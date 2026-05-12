// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title EcoSponsor
 * @author EcoHub Team
 * @notice The EcoHub crowdfunding contract. Projects are registered with an IPFS CID
 *         linking to their metadata. Funding is collected in an ERC-20 token (USDC).
 *         Funds are released to the project owner in milestone-based tranches.
 * @dev Uses OpenZeppelin's ReentrancyGuard and SafeERC20 for security.
 *      USDC has 6 decimals. All amounts in this contract are in token base units.
 */
contract EcoSponsor is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─── Constants ──────────────────────────────────────────────────────────────
    uint256 public constant TOTAL_STAGES = 3;

    // ─── State ───────────────────────────────────────────────────────────────────
    IERC20 public acceptedToken;
    uint256 public projectCount;

    // ─── Structs ─────────────────────────────────────────────────────────────────
    struct Project {
        uint256 id;
        address owner;
        string  metadataCID;    // IPFS CID pointing to project JSON
        uint256 fundingGoal;    // target amount in token base units (USDC: 6 decimals)
        uint256 totalFunded;    // total tokens contributed so far
        uint256 currentStage;   // next stage to be claimed (0 = none claimed yet)
        uint256 withdrawnAmount;// total tokens already withdrawn by owner
        bool    active;         // false = closed to new contributions
    }

    struct Contribution {
        address contributor;
        uint256 amount;
        uint256 timestamp;
    }

    // ─── Mappings ────────────────────────────────────────────────────────────────
    mapping(uint256 => Project)                              public projects;
    mapping(uint256 => Contribution[])                       public projectContributions;
    mapping(uint256 => mapping(address => uint256))          public contributorAmounts;

    // ─── Events ──────────────────────────────────────────────────────────────────
    event ProjectCreated(
        uint256 indexed id,
        address indexed owner,
        string  metadataCID,
        uint256 fundingGoal
    );

    event ProjectFunded(
        uint256 indexed id,
        address indexed contributor,
        uint256 amount,
        uint256 totalFunded
    );

    event FundsWithdrawn(
        uint256 indexed id,
        address indexed owner,
        uint256 amount,
        uint256 stageIndex
    );

    event ProjectDeactivated(uint256 indexed id, address indexed deactivatedBy);
    event AcceptedTokenUpdated(address indexed newToken);

    // ─── Errors ──────────────────────────────────────────────────────────────────
    error ProjectNotFound(uint256 id);
    error ProjectInactive(uint256 id);
    error InvalidFundingGoal();
    error InvalidMetadataCID();
    error InvalidAmount();
    error NotProjectOwner(uint256 id, address caller);
    error StageAlreadyClaimed(uint256 stage);
    error InsufficientContractBalance(uint256 required, uint256 available);
    error ZeroAddress();

    // ─── Constructor ─────────────────────────────────────────────────────────────

    /**
     * @param _acceptedToken Address of the ERC-20 token used for funding (e.g., USDC).
     */
    constructor(address _acceptedToken) Ownable(msg.sender) {
        if (_acceptedToken == address(0)) revert ZeroAddress();
        acceptedToken = IERC20(_acceptedToken);
    }

    // ─── External Functions ──────────────────────────────────────────────────────

    /**
     * @notice Register a new ecological project on-chain.
     * @param metadataCID IPFS CID of the project's metadata JSON (title, description, image).
     * @param fundingGoal Target funding amount in token base units.
     * @return projectId The unique ID assigned to this project.
     */
    function createProject(
        string calldata metadataCID,
        uint256 fundingGoal
    ) external returns (uint256 projectId) {
        if (bytes(metadataCID).length == 0) revert InvalidMetadataCID();
        if (fundingGoal == 0) revert InvalidFundingGoal();

        projectCount++;
        projectId = projectCount;

        projects[projectId] = Project({
            id:              projectId,
            owner:           msg.sender,
            metadataCID:     metadataCID,
            fundingGoal:     fundingGoal,
            totalFunded:     0,
            currentStage:    0,
            withdrawnAmount: 0,
            active:          true
        });

        emit ProjectCreated(projectId, msg.sender, metadataCID, fundingGoal);
    }

    /**
     * @notice Contribute tokens to an active ecological project.
     * @dev Caller must have approved this contract on the ERC-20 token first.
     * @param projectId The ID of the project to fund.
     * @param amount    Amount of tokens to contribute (in token base units).
     */
    function fundProject(
        uint256 projectId,
        uint256 amount
    ) external nonReentrant {
        if (projectId == 0 || projectId > projectCount) revert ProjectNotFound(projectId);
        Project storage project = projects[projectId];
        if (!project.active) revert ProjectInactive(projectId);
        if (amount == 0) revert InvalidAmount();

        // Transfer tokens from contributor to this contract
        acceptedToken.safeTransferFrom(msg.sender, address(this), amount);

        // Update state
        project.totalFunded += amount;
        contributorAmounts[projectId][msg.sender] += amount;
        projectContributions[projectId].push(Contribution({
            contributor: msg.sender,
            amount:      amount,
            timestamp:   block.timestamp
        }));

        emit ProjectFunded(projectId, msg.sender, amount, project.totalFunded);
    }

    /**
     * @notice Withdraw a milestone tranche of funds from a project.
     * @dev Can only be called by the project owner, in stage order.
     *      The contract divides the funding goal into TOTAL_STAGES equal tranches.
     *      The final stage claims any remaining balance to handle rounding.
     * @param projectId  The ID of the project.
     * @param stageIndex The stage index to claim (0-based, must match currentStage).
     */
    function withdrawFunds(
        uint256 projectId,
        uint256 stageIndex
    ) external nonReentrant {
        if (projectId == 0 || projectId > projectCount) revert ProjectNotFound(projectId);
        Project storage project = projects[projectId];

        if (msg.sender != project.owner) revert NotProjectOwner(projectId, msg.sender);
        if (stageIndex != project.currentStage) revert StageAlreadyClaimed(stageIndex);

        // Calculate tranche
        uint256 tranche;
        if (stageIndex == TOTAL_STAGES - 1) {
            // Last stage: take whatever is left in the contract for this project
            uint256 totalWithdrawable = project.totalFunded;
            tranche = totalWithdrawable - project.withdrawnAmount;
        } else {
            // Equal split per stage
            tranche = project.fundingGoal / TOTAL_STAGES;
        }

        uint256 contractBalance = acceptedToken.balanceOf(address(this));
        if (contractBalance < tranche) {
            revert InsufficientContractBalance(tranche, contractBalance);
        }

        // Update state before transfer (CEI pattern)
        project.currentStage++;
        project.withdrawnAmount += tranche;

        // Transfer tranche to project owner
        acceptedToken.safeTransfer(project.owner, tranche);

        emit FundsWithdrawn(projectId, project.owner, tranche, stageIndex);
    }

    /**
     * @notice Close a project to new contributions.
     * @dev Can be called by the project owner or the contract admin.
     * @param projectId The ID of the project to deactivate.
     */
    function deactivateProject(uint256 projectId) external {
        if (projectId == 0 || projectId > projectCount) revert ProjectNotFound(projectId);
        Project storage project = projects[projectId];

        bool isOwner = msg.sender == project.owner;
        bool isAdmin = msg.sender == owner();
        require(isOwner || isAdmin, "EcoSponsor: not authorized");

        project.active = false;
        emit ProjectDeactivated(projectId, msg.sender);
    }

    // ─── Admin Functions ─────────────────────────────────────────────────────────

    /**
     * @notice Update the accepted ERC-20 token address. Only callable by contract owner.
     * @param newToken Address of the new token.
     */
    function setAcceptedToken(address newToken) external onlyOwner {
        if (newToken == address(0)) revert ZeroAddress();
        acceptedToken = IERC20(newToken);
        emit AcceptedTokenUpdated(newToken);
    }

    // ─── View Functions ──────────────────────────────────────────────────────────

    /**
     * @notice Get full project details.
     * @param projectId The ID of the project.
     * @return Project struct.
     */
    function getProject(uint256 projectId) external view returns (Project memory) {
        if (projectId == 0 || projectId > projectCount) revert ProjectNotFound(projectId);
        return projects[projectId];
    }

    /**
     * @notice Get all contributions for a project.
     * @param projectId The ID of the project.
     * @return Array of Contribution structs.
     */
    function getContributions(uint256 projectId) external view returns (Contribution[] memory) {
        return projectContributions[projectId];
    }

    /**
     * @notice Get the total amount contributed by a specific address to a project.
     * @param projectId   The ID of the project.
     * @param contributor The contributor's wallet address.
     * @return Amount in token base units.
     */
    function getContributorAmount(
        uint256 projectId,
        address contributor
    ) external view returns (uint256) {
        return contributorAmounts[projectId][contributor];
    }

    /**
     * @notice Calculate the claimable tranche for the given stage.
     * @param projectId  The ID of the project.
     * @param stageIndex The stage index (0-based).
     * @return The amount claimable (in token base units).
     */
    function getWithdrawableAmount(
        uint256 projectId,
        uint256 stageIndex
    ) external view returns (uint256) {
        Project storage project = projects[projectId];
        if (stageIndex == TOTAL_STAGES - 1) {
            return project.totalFunded - project.withdrawnAmount;
        }
        return project.fundingGoal / TOTAL_STAGES;
    }
}
