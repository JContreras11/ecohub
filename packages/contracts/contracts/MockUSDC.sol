// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @notice A simple ERC-20 token for local testing, mimicking USDC's 6-decimal precision.
 */
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @notice Mint tokens to any address. For testing only.
     * @param to     Recipient address.
     * @param amount Amount in base units (6 decimals, so 1 USDC = 1_000_000).
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
