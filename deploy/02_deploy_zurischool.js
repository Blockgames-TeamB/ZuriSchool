/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// import { ethers } from "hardhat";
const { ethers } = require("hardhat");

// export default async ({ getNamedAccounts, deployments }) => {
async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // Get the previously deployed ZuriSchoolToken
  const zstoken = await ethers.getContractAt("ZuriSchoolToken", deployer);

  console.log("\n 🏵  Deploying ZuriSchool...\n");

  // Deploy the ZuriSchool contract
  await deploy("ZuriSchool", {
    from: deployer,
    args: [zstoken.address],
    log: true,
  });

  console.log("\n    ✅ confirming ...\n");

//   const zurischool = await ethers.getContract("ZuriSchool", deployer);
  const zurischool = await ethers.getContractAt("ZuriSchool", deployer);

  console.log("\n 🏵  Transfering ownership of ZuriSchoolToken to ZuriSchool ...\n");

  // Transfer ownership of ZuriSchoolToken to ZuriSchool
  const ownershipTransaction = await zstoken.transferOwnership(zurischool.address);

  console.log("\n    ✅ confirming...\n");

  console.log("\n 🏵  Transfering ownership of ZuriSchool to admin...\n");

  // // Transfer ownership of ZuriSchool to Admin
  // const ownershipTransaction2 = await zurischool.transferOwnership(
  //   "** YOUR FRONTEND ADDRESS **"
  // );

  // console.log("\n    ✅ confirming...\n");

  // await ownershipTransaction2.wait();
};

// export const tags = ["ZuriSchool"];