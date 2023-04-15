import { HardhatUserConfig, task } from "hardhat/config";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import * as dotenv from "dotenv";

dotenv.config();


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./src",
  },
  networks: {
    goerli: {
      chainId: 5,
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      live: true,
      saveDeployments: true,
    },
    chiado: {
      chainId: 10200,
      url: "https://rpc.chiadochain.net",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }
  }
}

export default config;