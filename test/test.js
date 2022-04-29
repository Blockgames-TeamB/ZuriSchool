const { expect, should } = require("chai");
const { ethers, getChainId } = require("hardhat");

let tokenContract,votingContract;

/**
 * student - fourthAddress
 * teacher - secondAddress
 * 
 */
describe("ZuriToken and ZuriVoting Contract Deployment...", function(){
    ;
    it("should deploy the ZuriToken contract", async function(){
        //Get Contract from Contract Factory
        const ZuriTokenContract = await ethers.getContractFactory("ZuriSchoolToken");
        const [owner] = await ethers.getSigners()
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
    it("Should mint 10000 tokens to deployer address",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        ownerBalance = await tokenContract.balanceOf(owner.address);
        totalSupply = await tokenContract.totalSupply();
        await expect(ownerBalance).to.be.equal(totalSupply);
        console.log("passed..");
    });
    it("Should mint tokens to address",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        minted = await tokenContract.connect(owner).mint(secondAddress.address,5);
        bal = await tokenContract.balanceOf(secondAddress.address);
        expect(bal).to.be.equal(5)
        console.log("passed..");
    });
});

///@notice test for checking roles of stakeholders on different states of the contract.
describe("Check Role of a stakeholder...",function(){
    it("Should not be able to check role when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).checkRole("teacher",secondAddress.address)).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should be able to check role when contract is not paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role when contract is not paused.");
        paused = await votingContract.connect(owner).checkRole("teacher",secondAddress.address);
        const tx = await paused;
        expect(tx).to.be.equal(false);
        console.log('\t',"Passed ....");     
    });
    it("Should be able to check role if role is director",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role is a director.");
        paused = await votingContract.connect(owner).checkRole("director",secondAddress.address);
        const tx = await paused;
        expect(tx).to.be.equal(false);
        console.log('\t',"Passed ....");     
    });
    it("Should be able to check role if role is chairman",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role is a chairman.");
        paused = await votingContract.connect(owner).checkRole("chairman",secondAddress.address);
        const tx = await paused;
        expect(tx).to.be.equal(false);
        console.log('\t',"Passed ....");     
    });
    it("Should be able to check role if role is student",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role is a student.");
        uploadStakeHolder = await votingContract.connect(owner).uploadStakeHolder("student",5,1,[fourthAddress.address])
        paused = await votingContract.connect(owner).checkRole("student",fourthAddress.address);
        const tx = await paused;
        expect(tx).to.be.equal(true);
        console.log('\t',"Passed ....");     
    });
})

///@notice test for uploading stakeholders with different roles.
describe("Uploading stakeholders...",function(){
    it("Should not be able to upload stakeholder if caller is not the chairman",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when caller is not the chairman.");
        await expect(votingContract.connect(thirdAddress).uploadStakeHolder("teacher",10,2,[secondAddress.address])).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log('\t',"Passed ...."); 
    });
    it("Should be able to upload stakeholder if caller is the chairman",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when caller is the chairman.");
        uploadStakeholder = await votingContract.connect(owner).uploadStakeHolder("teacher",10,2,[secondAddress.address]);
        const tx = await uploadStakeholder.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ...."); 
   
    });
    it("Should not be able to upload stakeholder if caller is not a teacher ",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when caller is not the teacher.");
        await expect(votingContract.connect(thirdAddress).uploadStakeHolder("teacher",10,2,[fourthAddress.address])).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log('\t',"Passed ....");
    });
    it("Should be able to upload stakeholder if caller is a teacher ",async function(){

        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when caller is the teacher.");
        //upload teacher as stakeholder
        uploadStakeholder = await votingContract.connect(owner).uploadStakeHolder("teacher",10,2,[secondAddress.address]);
        uploadStakeHolderByNewTeacher =await votingContract.connect(secondAddress).uploadStakeHolder("teacher",10,2,[thirdAddress.address]);
        const tx = await uploadStakeHolderByNewTeacher.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");
    });
    it("Should not upload stakeholders if there are no stakeholders(address of potential stakeholders)",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when there are no stakeholders.");
        //upload teacher as stakeholder
        await expect(votingContract.connect(owner).uploadStakeHolder("teacher",10,2,[])).to.be.revertedWith("Upload array of addresses");
        console.log('\t',"Passed ....");
    });
    it("Should not be able to upload stakeholders when contract is paused",async function(){
        const [owner] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).uploadStakeHolder("teacher",10,2,["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"])).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should be able to upload stakeholders when contract is not paused",async function(){
        const [owner] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when contract is not paused.");
        paused = await votingContract.connect(owner).uploadStakeHolder("teacher",10,2,["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"]);
        const tx = await paused.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");     
    });
})
///@notice test for Registering candidates.
describe("Registering Candidates for an Election...",function(){
    it("Should not be able to register candidate if caller is not the chairman",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to register candidate when caller is not the chairman.");
        //add category
        addCategory = await votingContract.connect(owner).addCategories("president");
        await expect(votingContract.connect(fourthAddress).registerCandidate("Santa","president")).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log('\t',"Passed ....");
    });
    it("Should be able to register candidate if caller is the chairman",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to register candidate when caller is the chairman.");
        registerCandidate = await votingContract.connect(owner).registerCandidate("Santa","president");
        const tx = await registerCandidate.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");
    });
    it("Should not be able to register candidate if caller is not a teacher ",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to register candidate when caller is not a teacher.");
        //remove teacher role from an address
        await expect(votingContract.connect(fourthAddress).registerCandidate("Santa","president")).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log('\t',"Passed ....");
    });
    it("Should be able to register candidate if caller is a teacher ",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to register candidate when caller is not a teacher.");
        //remove teacher role from an address
        registerCandidate1 =await votingContract.connect(secondAddress).registerCandidate("Santa","president");
        const tx = await registerCandidate1.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");
    });
    it("Should only be able to register candidate when contract is not paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to register candidate when contract is not paused.");
        paused = await votingContract.connect(owner).registerCandidate("Santa","president");
        const tx = await paused.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");  
    });
    it("Should not be able to register candidate when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).registerCandidate("Santa","president")).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    // it("Should not be able to register candidate if a candidate is already registered",async function(){
    //     const [owner,secondAddress] = await ethers.getSigners();
    //     console.log('\t',"Attempting to register candidate when candidate is already registered.");
    //    await expect(votingContract.connect(owner).activeCandidate[1]()).to.be.revertedWith("Candidate is already active for an election");
    //    console.log('\t',"Passed ....")
    // });
    it("Should not be able to register candidate if the category does not exit",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to register candidate when candidate category does not exist.");
       await expect(votingContract.connect(owner).registerCandidate("Santa","vice president")).to.be.revertedWith("Category does not exist...");
       console.log('\t',"Passed ....")
    });
})
///@notice test to Add Categories of an Election.
describe("Add Categories of an Election...",function(){
    it("Should only be able to add a category when contract is not paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Add Categories when contract is not paused.");
        paused = await votingContract.connect(owner).addCategories("senate");
        const tx = await paused.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");  
    });
    it("Should not be able to add a category when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Add Categories when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).addCategories("counsellor")).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
   
    });
   
    it("Should be able to add a category if caller is a teacher ",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to add a category when caller is not a teacher.");
        //remove teacher role from an address
        addCategory1 =await votingContract.connect(secondAddress).addCategories("headboy");
        const tx = await addCategory1.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");
    });
});
///@notice test to show Categories of an Election.
describe("Show Categories of an Election...",function(){
    it("Should not be able to show election categories when contract is paused",async function(){

        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Show Categories when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).showCategories()).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
   
    });
    it("Should be able to show election categories when contract is unpaused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Show Categories when contract is not paused.");
        paused = await votingContract.connect(owner).showCategories();
        
        expect(paused.length).to.be.greaterThanOrEqual(0);
        console.log('\t',"Passed ...."); 
    });
})
///@notice test to Set up an Election.
describe("Set up Election...",function(){
    it("Should not be able to Set up an Election if caller is not the chairman or teacher",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Set up Election as a non chairman....");
        await expect(votingContract.connect(fourthAddress).setUpElection("president",[1,2])).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log('\t',"Passed ....");
    });
    it("Should be able to Set up an Election if caller is the chairman or teacher",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Set up Election when caller is the chairman.");
        setUpElection = await votingContract.connect(owner).setUpElection("president",[1,2]);
        const tx = await setUpElection.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ...."); 
   
    });
    it("Should only be able to Set up an Election when contract is not paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Set up Election when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).setUpElection("president",[1,2])).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    
    
})
///@notice test to Clear Election Queue.
describe("Clear Election Queue...",function(){
    it("Should not be able to Clear Election Queue if caller is not the chairman",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Clear Election Queue as a non chairman....");
        await expect(votingContract.connect(secondAddress).clearElectionQueue()).to.be.revertedWith("Access granted to only the chairman");
        console.log('\t',"Passed ....");
    });
    it("Should be able to Clear Election Queue if caller is the chairman",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to assign role as a chairman....");
        //add address as a stakeholder
        clearQueue = await votingContract.connect(owner).clearElectionQueue();
        const tx = await clearQueue.wait();
        expect(tx.status).to.equal(1);
        console.log('\t',"Passed ....");
    });

    it("Should not be able to Clear Election Queue when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Clear Election Queue when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).clearElectionQueue()).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    
})
///@notice test to Start Voting Session.
describe("Start Voting Session...",function(){
    it("Should not be able to Start Voting Session if caller is not the chairman",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Clear Election Queue as a non chairman....");
        await expect(votingContract.connect(secondAddress).startVotingSession("president")).to.be.revertedWith("Access granted to only the chairman");
        console.log('\t',"Passed ....");
    });
    it("Should be able to Start Voting Session if caller is the chairman",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Set up Election when caller is the chairman.");
        setUpElection1 = await votingContract.connect(owner).setUpElection("president",[1,2]);

        const tx = await setUpElection1.wait();
        expect(tx.status).to.be.equal(1);
        startVotinsession = await votingContract.connect(owner).startVotingSession("president");
        const tx1 = await startVotinsession.wait();
        expect(tx1.status).to.be.equal(1);
        console.log('\t',"Passed ....");
    });
    
    it("Should not be able to Start Voting Session when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).startVotingSession("president")).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    
})
///@notice test to End Voting Session.
describe("End Voting Session...",function(){
    it("Should not be able to End Voting Session if caller is not the chairman",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Clear Election Queue as a non chairman....");
        await expect(votingContract.connect(secondAddress).endVotingSession("president")).to.be.revertedWith("Access granted to only the chairman");
        console.log('\t',"Passed ....");
    });
    it("Should be able to End Voting Session if caller is the chairman",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to End Voting Session when caller is the chairman.");
        setUpElection1 = await votingContract.connect(owner).setUpElection("president",[1,2]);

        const tx = await setUpElection1.wait();
        expect(tx.status).to.be.equal(1);
        startVotinsession = await votingContract.connect(owner).startVotingSession("president");
        const tx1 = await startVotinsession.wait();
        expect(tx1.status).to.be.equal(1);
        endVotingSession = await votingContract.connect(owner).endVotingSession("president");
        const tx2 = await endVotingSession.wait();
        expect(tx2.status).to.be.equal(1);

        console.log('\t',"Passed ....");
    });
  
    it("Should not be able to End Voting Session when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).endVotingSession("president")).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
   
    });
    
})
///@notice test for Voting for a Category.
describe("Voting For a Candidate Category ...",function(){
    before(async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        addC = await votingContract.connect(owner).addCategories("headboy");
        setUpElection1 = await votingContract.connect(owner).setUpElection("president",[1,2]);
        const tx = await setUpElection1.wait();
        expect(tx.status).to.be.equal(1);
        setUpElection2 = await votingContract.connect(owner).setUpElection("headboy",[1,2]);
        const tx2 = await setUpElection2.wait();
        expect(tx2.status).to.be.equal(1);
        
    });
    it("Should not be able to  vote if caller is not stakeholder",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        startVotinsession = await votingContract.connect(owner).startVotingSession("president");
        const tx1 = await startVotinsession.wait();
        expect(tx1.status).to.be.equal(1);
        console.log('\t',"Attempting to setup election.");
        console.log('\t',"Attempting to vote.");
        await expect(votingContract.connect(fifthAddress).vote("president",1)).to.be.revertedWith("You must be a registered stakeholder");
        console.log('\t',"Passed ....");   
    });
    
    it("Should not be able to vote when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote when contract is paused.");
        startVotinsession = await votingContract.connect(owner).startVotingSession("president");
        const tx1 = await startVotinsession.wait();
        expect(tx1.status).to.be.equal(1);
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).vote("president",1)).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should not be able to vote when if voting has not commenced ",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote when voting has not commenced.");
    
       await expect(votingContract.connect(owner).vote("headboy",1)).to.be.revertedWith("Voting has not commmenced for this Category");
       console.log('\t',"Passed ....")
      });
    it("Should not be able to vote if candidate is not registered for an office",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote for a candidate that is not registered for an office.");
    
       await expect(votingContract.connect(owner).vote("president",5)).to.be.revertedWith("Candidate is not registered for this position.");
       console.log('\t',"Passed ....")
    });

    it("Should not be able to vote for a category twice",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote for a candidate twice.");
        const firstVote = await votingContract.connect(owner).vote("president",1);
       await expect(votingContract.connect(owner).vote("president",1)).to.be.revertedWith("Cannot vote twice for a category..");
       console.log('\t',"Passed ....")
    });
    it("Should not be able to vote token is less than threshold of 1*10**18",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to upload stakeholder as student");
        // uploadStudent = await votingContract.connect(owner).uploadStakeHolder("student",[fourthAddress.address]);
        console.log('\t',"Attempting to burn account balance.");
        transferBalance = await tokenContract.connect(fourthAddress).transfer(owner.address,ethers.utils.parseEther("5"));
        console.log("Transferred..");
        tb= await tokenContract.balanceOf(fourthAddress.address);
        console.log("balance ==== ",tb);
        console.log('\t',"Attempting to vote with a low balance.");
        await expect(votingContract.connect(fourthAddress).vote("president",1)).to.be.revertedWith("YouR balance is currently not sufficient to vote. Not a stakeholder");
       console.log('\t',"Passed ....")
    });
    
    it("Should not be able to vote if voting has ended for a category",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to when voting has ended for a category");
        endVotingSession = await votingContract.connect(owner).endVotingSession("president");
       await expect(votingContract.connect(owner).vote("president",1)).to.be.revertedWith("Voting has not commmenced for this Category");
       console.log('\t',"Passed ....")
    });
    
})
///@notice test for Get Winning Candidate for a Category.
describe("Get Winning Candidate for a Category ...",function(){
    
    it("Should not be able to Get Winning Candidate if votes has not been counted",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log("\t","Attempting to get winning candidate when votes has not been counted");
        await expect(votingContract.connect(owner).getWinningCandidate("senate")).to.be.revertedWith("Only allowed after votes have been counted");
        console.log('\t',"Passed ....")
    });
    it("Should not be able to Get Winning Candidate when contract is paused",async function(){
        const [owner] = await ethers.getSigners();
        console.log("\t","Attempting to get winning candidate when contract is paused");
        endVotingSession = await votingContract.connect(owner).endVotingSession("president");
        compileVotes = await votingContract.connect(owner).compileVotes("president");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
        await expect(votingContract.connect(owner).getWinningCandidate("president")).to.be.revertedWith("Contract is currently paused");
        console.log('\t',"Passed ....")
        const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should only be able to Get Winning Candidate when contract is not paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log("\t","Attempting to get winning candidate when contract is not paused");
         //end voting
        winningCandidate = await votingContract.connect(owner).getWinningCandidate("president");
        // console.log("here winning candidate",winningCandidate)
        expect(winningCandidate[0].id).to.equal(1);
        console.log('\t',"Passed ....");
    });
   
})
///@notice test for fetching election.
describe("Fetch Election ...",function(){
    it("Should only be able to Fetch Election when contract is not paused",async function(){
        const [owner] = await ethers.getSigners();
        console.log("\t","Attempting to Fetch Election when contract is not paused");
        elections = await votingContract.connect(owner).fetchElection();
        expect(elections.length).to.greaterThan(1);
        console.log('\t',"Passed ....");

    });
    it("Should not be able to Fetch Election  when contract is paused",async function(){
        const [owner] = await ethers.getSigners();
        console.log("\t","Attempting to Fetch Election  when contract is paused");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
        await expect(votingContract.connect(owner).fetchElection()).to.be.revertedWith("Contract is currently paused");
        console.log('\t',"Passed ....")
        const unpaused = await votingContract.connect(owner).setPaused(false);
    
    });
    
})
///@notice test for Compiling Votes for an election.
describe("Compiling Votes for an election ...",function(){
    before("Set up election and vote",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        addCategory = await votingContract.connect(owner).addCategories("senate");
        registerCandidate = await votingContract.connect(owner).registerCandidate("prince","senate");
        registerCandidate1 = await votingContract.connect(owner).registerCandidate("charming","senate");
        setUpElection = await votingContract.connect(owner).setUpElection("senate",[4,5]);
        startVotingSession = await votingContract.connect(owner).startVotingSession("senate");
        firstVote = await  votingContract.connect(secondAddress).vote("senate",4);
        secondVote = await votingContract.connect(owner).vote("senate",5);
    })
    
    it("Should not be able to Compiling Votes if caller is not the chairman",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to Compiling Votes if caller is not the chairman");
        await expect(votingContract.connect(fifthAddress).compileVotes("senate")).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log('\t',"passed")
        
    });
    it("Should not be able to Compiling Votes if caller is not a teacher ",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to Compiling Votes if caller is not the teacher");
        await expect(votingContract.connect(fourthAddress).compileVotes("senate")).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log('\t',"passed")
    });
    it("Should not be able to Compiling Votes when voting session has not ended",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to Compiling Votes when voting session has not ended");
        await expect(votingContract.connect(secondAddress).compileVotes("senate")).to.be.revertedWith("This session is still active for voting");
        console.log('\t',"passed")
    });
    it("Should not be able to Compiling Votes  when contract is paused",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to Compiling Votes when contract is paused");
        endVotingSession = await votingContract.connect(owner).endVotingSession("senate");
        //compile votes 
        compileVotes = await votingContract.connect(owner).compileVotes("senate");
        //pause the contract
         const paused = await votingContract.connect(owner).setPaused(true);
         await expect(votingContract.connect(owner).getWinningCandidate("senate")).to.be.revertedWith("Contract is currently paused");
         console.log('\t',"Passed ....")
         const unpaused = await votingContract.connect(owner).setPaused(false);
   
    });
    it("Should only be able to Compiling Votes  when contract is not paused",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to Compiling Votes when contract is not paused");
        compiled = await votingContract.connect(secondAddress).compileVotes("senate");
        const tx= await compiled.wait();
        expect(tx.status).to.equal(1);
        console.log('\t',"passed")
    });
    
})
///@notice test for Pausing Contract.
describe("Pausing Contract ...",function(){
    it("Should not be able to Pause Contract if caller is not the chairman",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log("\t","Attempting to Pause Contract if caller is the chairman");
        await expect(votingContract.connect(secondAddress).setPaused(true)).to.be.revertedWith("Access granted to only the chairman");
        console.log('\t',"passed")
    });
    it("Should be able to Pause Contract if caller is the chairman",async function(){
        
        const [owner] = await ethers.getSigners();
        console.log("\t","Attempting to  Pause Contract if caller is not the chairman");
        //pause the contract
        paused = await votingContract.connect(owner).setPaused(true);
        const tx = await paused.wait();
        expect(tx.status).to.equal(1);
        console.log('\t',"Passed ....")
        const unpaused = await votingContract.connect(owner).setPaused(false);
  

    });
    
})
///@notice test for Making Election Result Public.
describe("Make Election Result Public ...",function(){
    before("Set up election and vote",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        addCategory = await votingContract.connect(owner).addCategories("counsellor");
        registerCandidate = await votingContract.connect(owner).registerCandidate("prince","counsellor");
        registerCandidate1 = await votingContract.connect(owner).registerCandidate("charming","counsellor");
        setUpElection = await votingContract.connect(owner).setUpElection("counsellor",[6,7]);
        startVotingSession = await votingContract.connect(owner).startVotingSession("counsellor");
        firstVote = await  votingContract.connect(secondAddress).vote("counsellor",7);
        secondVote = await votingContract.connect(owner).vote("counsellor",6);
    })
    it("Should not be able to Make Election Result Public if caller is not the chairman",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to  Make Election Result Public if caller is not the chairman");
        await expect(votingContract.connect(fifthAddress).makeResultPublic("senate")).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log('\t',"Passed ....")
    });
    it("Should be able to Make Election Result Public if caller is the chairman",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to  Make Election Result Public if caller is not the chairman");
        makeresultpublic = await votingContract.connect(owner).makeResultPublic("senate");
        const tx = await makeresultpublic.wait();
        expect(tx.status).to.equal(1);
        console.log('\t',"Passed ....")
    });
    it("Should not be able to Make Election Result Public if caller is not the teacher",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress] = await ethers.getSigners();
         console.log("\t","Attempting to  Make Election Result Public if caller is not the teacher");
        await expect(votingContract.connect(fourthAddress).makeResultPublic("senate")).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log('\t',"Passed ....")
    
    });
    it("Should be able to Make Election Result Public if caller is the teacher",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to  Make Election Result Public if caller is the teacher");
        makeresultpublic = await votingContract.connect(secondAddress).makeResultPublic("senate");
        const tx = await makeresultpublic.wait();
        expect(tx.status).to.equal(1);
        console.log('\t',"Passed ....")
    });
    it("Should not be able to Make Election Result Public if the session is still active",async function(){
        const [owner] = await ethers.getSigners();
        console.log("\t","Attempting to  Make Election Result Public when session is still active");
        endVotingSession = await votingContract.connect(owner).endVotingSession("counsellor");
        await expect(votingContract.connect(owner).makeResultPublic("counsellor")).to.be.revertedWith("This session is still active, voting has not yet been counted");
        console.log('\t',"Passed ....")
    });
    
})
///@notice test for showing queue
describe("Show election Queue",function(){
    it("Show not be able to show queue when contract is paused", async function(){
        //get signers
        const [owner] = await ethers.getSigners();
        console.log('\t',"Attempting to pause the contract...");
        paused = await votingContract.connect(owner).setPaused(true);
        await expect(votingContract.connect(owner).showQueue()).to.be.revertedWith("Contract is currently paused");
        unpaused =await votingContract.connect(owner).setPaused(false); 
        console.log("passed..."); 
    });
    it("Show be able to show queue when contract is not paused", async function(){
        //get signers
        const [owner] = await ethers.getSigners();
        console.log('\t',"Attempting to show queue...");
        showQueue = await votingContract.connect(owner).showQueue();
        expect(showQueue.length).to.be.greaterThan(1);
        console.log("passed..."); 
    });
})

///@notice test for Changing Chairmanroles to stakeholders.
describe("Change Chairman role...",function(){
    it("Should not be able to Change Chairman role if caller is not the chairman",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change Chairman role as a non chairman....");
        await expect(votingContract.connect(secondAddress).changeChairman(secondAddress.address)).to.be.revertedWith("Access granted to only the chairman");
        console.log('\t',"Passed ....");
    });
   
    it("Should revert if address is not a stakeholder",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change Chairman role to a non stakeholder....");
        await expect(votingContract.connect(owner).changeChairman(ninthAddress.address)).to.be.revertedWith("Can't assign a role of chairman to a non stakeholder.")
        console.log('\t',"Passed ....");
    });
    it("Should revert when contract is paused",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to assign role as a chairman....");
        //add address as a stakeholder
        addStakeholder = await votingContract.connect(owner).uploadStakeHolder("director",20,3,[seventhAddress.address]);
        const paused = await votingContract.connect(owner).setPaused(true);
        await expect(votingContract.connect(owner).changeChairman(seventhAddress.address)).to.be.revertedWith("Contract is currently paused");
        const unpaused = await votingContract.connect(owner).setPaused(false);
        console.log('\t',"Passed ....");
    
    });
    it("Should be able to Change Chairman role if caller is the chairman",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change Chairman role as a chairman....");
        //add address as a stakeholder
        addStakeholder = await votingContract.connect(owner).uploadStakeHolder("teacher",10,2,[secondAddress.address]);
        addStakeholder1 = await votingContract.connect(owner).uploadStakeHolder("director",20,3,[eightAddress.address]);
        changeChairman =await votingContract.connect(owner).changeChairman(eightAddress.address);
        const tx = await changeChairman.wait();
        expect(tx.status).to.equal(1);
        console.log('\t',"Passed ....");
    });
})
