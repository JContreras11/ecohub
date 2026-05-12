import { expect } from "chai";
import { ethers } from "hardhat";
import { EcoSponsor, MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("EcoSponsor", function () {
  let ecoSponsor: EcoSponsor;
  let mockUSDC: MockUSDC;
  let owner: SignerWithAddress;
  let projectOwner: SignerWithAddress;
  let contributor1: SignerWithAddress;
  let contributor2: SignerWithAddress;

  const FUNDING_GOAL = ethers.parseUnits("300", 6); // 300 USDC
  const TRANCHE = FUNDING_GOAL / 3n;                 // 100 USDC
  const TEST_CID = "QmTestCIDHash123456789";

  beforeEach(async function () {
    [owner, projectOwner, contributor1, contributor2] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDCFactory.deploy();

    // Mint USDC to contributors
    await mockUSDC.mint(contributor1.address, ethers.parseUnits("1000", 6));
    await mockUSDC.mint(contributor2.address, ethers.parseUnits("1000", 6));

    // Deploy EcoSponsor
    const EcoSponsorFactory = await ethers.getContractFactory("EcoSponsor");
    ecoSponsor = await EcoSponsorFactory.deploy(await mockUSDC.getAddress());
  });

  // ── createProject ────────────────────────────────────────────────────────────
  describe("createProject()", function () {
    it("should create a project and emit ProjectCreated", async function () {
      const tx = ecoSponsor.connect(projectOwner).createProject(TEST_CID, FUNDING_GOAL);
      await expect(tx)
        .to.emit(ecoSponsor, "ProjectCreated")
        .withArgs(1, projectOwner.address, TEST_CID, FUNDING_GOAL);
    });

    it("should increment projectCount", async function () {
      await ecoSponsor.connect(projectOwner).createProject(TEST_CID, FUNDING_GOAL);
      expect(await ecoSponsor.projectCount()).to.equal(1);
    });

    it("should store correct project data", async function () {
      await ecoSponsor.connect(projectOwner).createProject(TEST_CID, FUNDING_GOAL);
      const project = await ecoSponsor.getProject(1);
      expect(project.id).to.equal(1);
      expect(project.owner).to.equal(projectOwner.address);
      expect(project.metadataCID).to.equal(TEST_CID);
      expect(project.fundingGoal).to.equal(FUNDING_GOAL);
      expect(project.totalFunded).to.equal(0);
      expect(project.active).to.be.true;
    });

    it("should revert with empty CID", async function () {
      await expect(
        ecoSponsor.connect(projectOwner).createProject("", FUNDING_GOAL)
      ).to.be.revertedWithCustomError(ecoSponsor, "InvalidMetadataCID");
    });

    it("should revert with zero funding goal", async function () {
      await expect(
        ecoSponsor.connect(projectOwner).createProject(TEST_CID, 0)
      ).to.be.revertedWithCustomError(ecoSponsor, "InvalidFundingGoal");
    });
  });

  // ── fundProject ──────────────────────────────────────────────────────────────
  describe("fundProject()", function () {
    beforeEach(async function () {
      await ecoSponsor.connect(projectOwner).createProject(TEST_CID, FUNDING_GOAL);
    });

    it("should accept contributions and emit ProjectFunded", async function () {
      const amount = ethers.parseUnits("100", 6);
      await mockUSDC.connect(contributor1).approve(await ecoSponsor.getAddress(), amount);

      await expect(
        ecoSponsor.connect(contributor1).fundProject(1, amount)
      )
        .to.emit(ecoSponsor, "ProjectFunded")
        .withArgs(1, contributor1.address, amount, amount);
    });

    it("should update totalFunded and contributorAmounts", async function () {
      const amount = ethers.parseUnits("50", 6);
      await mockUSDC.connect(contributor1).approve(await ecoSponsor.getAddress(), amount);
      await ecoSponsor.connect(contributor1).fundProject(1, amount);

      const project = await ecoSponsor.getProject(1);
      expect(project.totalFunded).to.equal(amount);
      expect(await ecoSponsor.getContributorAmount(1, contributor1.address)).to.equal(amount);
    });

    it("should revert for inactive project", async function () {
      await ecoSponsor.connect(projectOwner).deactivateProject(1);
      const amount = ethers.parseUnits("50", 6);
      await mockUSDC.connect(contributor1).approve(await ecoSponsor.getAddress(), amount);
      await expect(
        ecoSponsor.connect(contributor1).fundProject(1, amount)
      ).to.be.revertedWithCustomError(ecoSponsor, "ProjectInactive");
    });

    it("should revert for zero amount", async function () {
      await expect(
        ecoSponsor.connect(contributor1).fundProject(1, 0)
      ).to.be.revertedWithCustomError(ecoSponsor, "InvalidAmount");
    });
  });

  // ── withdrawFunds ────────────────────────────────────────────────────────────
  describe("withdrawFunds()", function () {
    beforeEach(async function () {
      await ecoSponsor.connect(projectOwner).createProject(TEST_CID, FUNDING_GOAL);

      // Fund the project fully (300 USDC)
      await mockUSDC.connect(contributor1).approve(await ecoSponsor.getAddress(), FUNDING_GOAL);
      await ecoSponsor.connect(contributor1).fundProject(1, FUNDING_GOAL);
    });

    it("should allow stage 0 withdrawal and emit FundsWithdrawn", async function () {
      await expect(ecoSponsor.connect(projectOwner).withdrawFunds(1, 0))
        .to.emit(ecoSponsor, "FundsWithdrawn")
        .withArgs(1, projectOwner.address, TRANCHE, 0);
    });

    it("should transfer correct tranche to owner", async function () {
      const balanceBefore = await mockUSDC.balanceOf(projectOwner.address);
      await ecoSponsor.connect(projectOwner).withdrawFunds(1, 0);
      const balanceAfter = await mockUSDC.balanceOf(projectOwner.address);
      expect(balanceAfter - balanceBefore).to.equal(TRANCHE);
    });

    it("should allow sequential stage withdrawals", async function () {
      await ecoSponsor.connect(projectOwner).withdrawFunds(1, 0);
      await ecoSponsor.connect(projectOwner).withdrawFunds(1, 1);
      await ecoSponsor.connect(projectOwner).withdrawFunds(1, 2);

      const project = await ecoSponsor.getProject(1);
      expect(project.currentStage).to.equal(3);
      expect(project.withdrawnAmount).to.equal(FUNDING_GOAL);
    });

    it("should revert if non-owner attempts withdrawal", async function () {
      await expect(
        ecoSponsor.connect(contributor1).withdrawFunds(1, 0)
      ).to.be.revertedWithCustomError(ecoSponsor, "NotProjectOwner");
    });

    it("should revert if stage is out of order", async function () {
      // Stage 0 is correct, but attempting stage 1 first should fail
      await expect(
        ecoSponsor.connect(projectOwner).withdrawFunds(1, 1)
      ).to.be.revertedWithCustomError(ecoSponsor, "StageAlreadyClaimed");
    });
  });

  // ── deactivateProject ────────────────────────────────────────────────────────
  describe("deactivateProject()", function () {
    beforeEach(async function () {
      await ecoSponsor.connect(projectOwner).createProject(TEST_CID, FUNDING_GOAL);
    });

    it("should allow project owner to deactivate", async function () {
      await expect(ecoSponsor.connect(projectOwner).deactivateProject(1))
        .to.emit(ecoSponsor, "ProjectDeactivated")
        .withArgs(1, projectOwner.address);

      const project = await ecoSponsor.getProject(1);
      expect(project.active).to.be.false;
    });

    it("should allow contract owner (admin) to deactivate", async function () {
      await expect(ecoSponsor.connect(owner).deactivateProject(1))
        .to.emit(ecoSponsor, "ProjectDeactivated");
    });

    it("should revert for unauthorized address", async function () {
      await expect(
        ecoSponsor.connect(contributor1).deactivateProject(1)
      ).to.be.reverted;
    });
  });
});
