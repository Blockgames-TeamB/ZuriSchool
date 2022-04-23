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

///@notice test for checking roles of stakeholders on different states of the contract.
describe("Check Role of a stakeholder...",function(){
    it("Should not be able to check role when contract is paused",async function(){

    });
    it("Should be able to check role when contract is not paused",async function(){

    });
})
///@notice test for assigning roles to stakeholders.
describe("Assign Role of a stakeholders...",function(){
    it("Should not be able to assign role if caller is not the chairman",async function(){

    });
    it("Should be able to assign role if caller is the chairman",async function(){

    });
})
///@notice test for removing roles to stakeholders.
describe("Remove Role of a stakeholders....",function(){
    it("Should not be able to remove role if caller is not the chairman",async function(){

    });
    it("Should be able to remove role if caller is the chairman",async function(){

    });
})
///@notice test for uploading stakeholders with different roles.
describe("Uploading stakeholders...",function(){
    it("Should not be able to upload stakeholder if caller is not the chairman",async function(){

    });
    it("Should be able to upload stakeholder if caller is the chairman",async function(){

    });
    it("Should not be able to upload stakeholder if caller is not a teacher ",async function(){

    });
    it("Should be able to upload stakeholder if caller is a teacher ",async function(){

    });
    it("Should only upload stakeholders if there are stakeholders(address of potential stakeholders)",async function(){

    });
    it("Should not upload stakeholders if there are no stakeholders(address of potential stakeholders)",async function(){

    });
})
///@notice test for Registering candidates.
describe("Registering Candidates for an Election...",function(){
    it("Should not be able to register candidate if caller is not the chairman",async function(){

    });
    it("Should be able to register candidate if caller is the chairman",async function(){

    });
    it("Should not be able to register candidate if caller is not a teacher ",async function(){

    });
    it("Should be able to register candidate if caller is a teacher ",async function(){

    });
    it("Should only be able to register candidate when contract is not paused",async function(){

    });
    it("Should not be able to register candidate when contract is paused",async function(){

    });
    it("Should not be able to register candidate if a candidate is already registered",async function(){

    });
    it("Should not be able to register candidate if the category does not exit",async function(){

    });
})
///@notice test to Add Categories of an Election.
describe("Add Categories of an Election...",function(){
    it("Should only be able to add a category when contract is not paused",async function(){

    });
    it("Should not be able to add a category when contract is paused",async function(){

    });
    it("Should not be able to add a category if caller is not the chairman",async function(){

    });
    it("Should be able to add a category if caller is the chairman",async function(){

    });
    it("Should not be able to add a category if caller is not a teacher ",async function(){

    });
    it("Should be able to add a category if caller is a teacher ",async function(){

    });
});
///@notice test to show Categories of an Election.
describe("Show Categories of an Election...",function(){
    it("Should not be able to show election categories when contract is paused",async function(){

    });
    it("Should be able to show election categories when contract is unpaused",async function(){

    });
})
///@notice test to Set up an Election.
describe("Set up Election...",function(){
    it("Should not be able to Set up an Election if caller is not the chairman",async function(){

    });
    it("Should be able to Set up an Election if caller is the chairman",async function(){

    });
    it("Should not be able to Set up an Election if caller is not a teacher ",async function(){

    });
    it("Should be able to Set up an Election if caller is a teacher ",async function(){

    });
    it("Should only be able to Set up an Election when contract is not paused",async function(){

    });
    it("Should not be able to Set up an Election when contract is paused",async function(){

    });
    
})
///@notice test to Clear Election Queue.
describe("Clear Election Queue...",function(){
    it("Should not be able to Clear Election Queue if caller is not the chairman",async function(){

    });
    it("Should be able to Clear Election Queue if caller is the chairman",async function(){

    });
    it("Should only be able to Clear Election Queue when contract is not paused",async function(){

    });
    it("Should not be able to Clear Election Queue when contract is paused",async function(){

    });
    
})
///@notice test to Start Voting Session.
describe("Start Voting Session...",function(){
    it("Should not be able to Start Voting Session if caller is not the chairman",async function(){

    });
    it("Should be able to Start Voting Session if caller is the chairman",async function(){

    });
    it("Should only be able to Start Voting Session when contract is not paused",async function(){

    });
    it("Should not be able to Start Voting Session when contract is paused",async function(){

    });
    
})
///@notice test to End Voting Session.
describe("End Voting Session...",function(){
    it("Should not be able to End Voting Session if caller is not the chairman",async function(){

    });
    it("Should be able to End Voting Session if caller is the chairman",async function(){

    });
    it("Should only be able to End Voting Session when contract is not paused",async function(){

    });
    it("Should not be able to End Voting Session when contract is paused",async function(){

    });
    
})
///@notice test for Voting for a Category.
describe("Voting For a Candidate Category ...",function(){
    it("Should not be able to End Voting Session if caller is not the chairman",async function(){

    });
    it("Should be able to End Voting Session if caller is the chairman",async function(){

    });
    it("Should only be able to End Voting Session when contract is not paused",async function(){

    });
    it("Should not be able to End Voting Session when contract is paused",async function(){

    });
    
})
