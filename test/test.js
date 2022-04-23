const { expect } = require("chai");
const { ethers } = require("hardhat");

let tokenContract,votingContract;

describe("ZuriToken and ZuriVoting Contract Deployment...", function(){
    it("should deploy the ZuriToken contract", async function(){
        //Get Contract from Contract Factory
        const ZuriTokenContract = await ethers.getContractFactory("ZuriSchoolToken");
        const [owner] = await ethers.getSigners();
        // here we deploy the contract
        const deployedZuriTokenContract = await ZuriTokenContract.connect(owner).deploy();
    
        // Wait for it to finish deploying
        tokenContract = await deployedZuriTokenContract.deployed();
    
        // print the address of the deployed contract
        console.log(
            "\n ZuriSchool Contract Address:",
            tokenContract.address
        );
      });

    it("should deploy the ZuriVoting contract", async function(){
        //Get Contract from Contract Factory
        const ZuriVotingContract = await ethers.getContractFactory("ZuriSchool");
        const [owner] = await ethers.getSigners();
        // here we deploy the contract
        const deployedZuriVotingContract = await ZuriVotingContract.connect(owner).deploy(tokenContract.address);
    
        // Wait for it to finish deploying
        votingContract = await deployedZuriVotingContract.deployed();
    
        // print the address of the deployed contract
        console.log(
            "\n ZuriVoting Contract Address:",
            votingContract.address
        );

    });
});
