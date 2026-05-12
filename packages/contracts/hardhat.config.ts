import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from the monorepo root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x" + "0".repeat(64);
const RPC_URL_SEPOLIA = process.env.RPC_URL_SEPOLIA || "";
const RPC_URL_AMOY = process.env.RPC_URL_AMOY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Local development node
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // Ethereum Sepolia Testnet
    sepolia: {
      url: RPC_URL_SEPOLIA,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    // Polygon Amoy Testnet
    amoy: {
      url: RPC_URL_AMOY,
      accounts: [PRIVATE_KEY],
      chainId: 80002,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
    ],
  },
};

export default config;
