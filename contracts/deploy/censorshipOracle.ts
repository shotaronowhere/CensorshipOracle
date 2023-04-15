import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";


const deployCensorshipOracle: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { ethers, deployments, getNamedAccounts, getChainId, config } = hre;
  const { deploy } = deployments;
  const chainId = Number(await getChainId());

  const deployer = (await getNamedAccounts()).deployer ?? (await hre.ethers.getSigners())[0].address;

  // ----------------------------------------------------------------------------------------------
  const hardhatDeployer = async () => {
    const CensorshipOracle = await deploy("CensorshipOracle", {
      from: deployer,
      args: [      ],
      log: true,
    });
  };

  // ----------------------------------------------------------------------------------------------
  const liveDeployer = async () => {
    const CensorshipOracle = await deploy("CensorshipOracle", {
      from: deployer,
      args: [      ],
      log: true,
    });
  };
  // ----------------------------------------------------------------------------------------------
  if (chainId === 31337) {
    await hardhatDeployer();
  } else {
    await liveDeployer();
  }
};

export default deployCensorshipOracle;
