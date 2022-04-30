//implement ethers from hardhat
// import { ethers } from "hardhat";
const { ethers } = require("hardhat");

// export default async ({ getNamedAccounts, deployments }) => {
async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // console.log("\n 🏵  Deploying Nestcoin...\n");
  console.log("deploying ZuriSchoolToken contract ... \n")

  await deploy("ZuriSchoolToken", {
    from: deployer,
    log: true,
  });

  console.log("\n    ✅ confirming...\n");

  // const zstoken = await ethers.getContract("ZuriSchoolToken", deployer);
  const zstoken = await ethers.getContractAt("ZuriSchoolToken", deployer);
};

// export const tags = ["ZuriSchoolToken"];

// async function main(){
    
//  console.log("deploying ZuriSchoolToken contract.......")
//     const ZSTokenContract = await ethers.getContractFactory("ZuriSchoolToken");

//     // here we deploy the contract
//     const deployedZSTokenContract = await ZSTokenContract.deploy();

//     // Wait for it to finish deploying
//   await deployedZSTokenContract.deployed();

//   // print the address of the deployed contract
//   console.log(
//     "\n 🏵 ZuriSchoolToken Contract Address:",
//     deployedZSTokenContract.address
//   );
// }

// // Call the main function and catch if there is any error
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
