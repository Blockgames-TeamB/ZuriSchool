const { expect } = require("chai");
const { ethers } = require("hardhat");

let contract

describe("ZuriSchool", function(){
    it("should deploy the ZuriSchool contract to the testnet", async function(){
        //Get Contract from Contract Factory
        const ZuriSchoolContract = await ethers.getContractFactory("ZuriSchool");

        // here we deploy the contract
        const deployedZuriSchoolContract = await ZuriSchoolContract.deploy();
    
        // Wait for it to finish deploying
        contract = await deployedZuriSchoolContract.deployed();
    
        // print the address of the deployed contract
        console.log(
            "\n ZuriSchool Contract Address:",
            deployedZuriSchoolContract.address
        );

      });
});