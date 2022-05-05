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
        console.log("passed...")
        // print the address of the deployed contract
        console.log(
            "\n should deploy the ZuriVoting contract \n Deploying..."
        );
        const ZuriVotingContract = await ethers.getContractFactory("ZuriSchool");
        // here we deploy the contract
        const deployedZuriVotingContract = await ZuriVotingContract.connect(owner).deploy(tokenContract.address);
    
        // Wait for it to finish deploying
        votingContract = await deployedZuriVotingContract.deployed();
    
        // print the address of the deployed contract
        console.log(
            "\n ZuriVoting Contract Address:",
            votingContract.address
        );
        console.log("passed...")
      });
   

    it("Should mint 40 tokens to deployer address",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        ownerBalance = await tokenContract.balanceOf(owner.address);
        totalSupply = await tokenContract.totalSupply();
        console.log("totalsupply::",totalSupply," ownerbalance::",ownerBalance)
        await expect(ownerBalance).to.be.equal(totalSupply);
        console.log("passed..");
    });
    it("Should mint tokens to address",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        contractChairman = await tokenContract.chairman();
        console.log("token chairman",contractChairman)
        minted = await tokenContract.connect(owner).mint(secondAddress.address,10);
        bal = await tokenContract.balanceOf(secondAddress.address);
        console.log("bal===",bal)
        expect(bal).to.be.equal(10)
        console.log("passed..");
    });
    it("Should not mint tokens to address if caller is not a teacher or chairman",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        await expect(tokenContract.connect(thirdAddress).mint(secondAddress.address,10)).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log("passed..");
    });
    it("Should mint tokens to stakeHolders Directors if caller is chairman or teacher",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
        minted = await tokenContract.connect(owner).mintToStakeholder(20,"director",[eightAddress.address,secondAddress.address,tenthAddress.address]);
        bal = await tokenContract.balanceOf(eightAddress.address);
        expect(bal).to.be.equal(ethers.utils.parseEther("20"));
        console.log("passed..");
    });
    it("Should not mint tokens to stakeHolders if caller is not the chairman or teacher",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
        await expect(tokenContract.connect(fourthAddress).mintToStakeholder(20,"director",[eightAddress.address,secondAddress.address,tenthAddress.address])).to.be.revertedWith("Access granted to only the chairman or teacher");
       
        console.log("passed..");
    });
    it("Should revert if there are no address to mint to ...",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
        await expect(tokenContract.connect(owner).mintToStakeholder(20,"director",[])).to.be.revertedWith("Upload array of addresses");
       
        console.log("passed..");
    });
    it("Should mint to students...",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
        mintToStudent =await tokenContract.connect(owner).mintToStakeholder(5,"student",[fourthAddress.address]);
        bal = await tokenContract.balanceOf(fourthAddress.address);
        expect(bal).to.be.equal(ethers.utils.parseEther("5"));
        console.log("passed..");
    });
    it("Should mint to teacher...",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
        const  initbal = await tokenContract.balanceOf(secondAddress.address);
        burnToken = await tokenContract.connect(secondAddress).transfer(owner.address,initbal);
        mintToStudent =await tokenContract.connect(owner).mintToStakeholder(10,"teacher",[secondAddress.address]);
        const  bal = await tokenContract.balanceOf(secondAddress.address);
        expect(bal).to.be.equal(ethers.utils.parseEther("10"));
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
        uploadStakeHolder = await votingContract.connect(owner).uploadStakeHolder("student",1,[fourthAddress.address])
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
        await expect(votingContract.connect(thirdAddress).uploadStakeHolder("teacher",2,[secondAddress.address])).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log('\t',"Passed ...."); 
    });
    it("Should be able to upload stakeholder if caller is the chairman",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when caller is the chairman.");
        uploadStakeholder = await votingContract.connect(owner).uploadStakeHolder("teacher",2,[secondAddress.address]);
        const tx = await uploadStakeholder.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ...."); 
   
    });
    it("Should not be able to upload stakeholder if caller is not a teacher ",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when caller is not the teacher.");
        await expect(votingContract.connect(thirdAddress).uploadStakeHolder("teacher",2,[fourthAddress.address])).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log('\t',"Passed ....");
    });
    it("Should be able to upload stakeholder if caller is a teacher ",async function(){

        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when caller is the teacher.");
        //upload teacher as stakeholder
        uploadStakeholder = await votingContract.connect(owner).uploadStakeHolder("teacher",2,[secondAddress.address]);
        uploadStakeHolderByNewTeacher =await votingContract.connect(secondAddress).uploadStakeHolder("teacher",2,[thirdAddress.address]);
        const tx = await uploadStakeHolderByNewTeacher.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");
    });
    it("Should not upload stakeholders if there are no stakeholders(address of potential stakeholders)",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when there are no stakeholders.");
        //upload teacher as stakeholder
        await expect(votingContract.connect(owner).uploadStakeHolder("teacher",2,[])).to.be.revertedWith("Upload array of addresses");
        console.log('\t',"Passed ....");
    });
    it("Should not be able to upload stakeholders when contract is paused",async function(){
        const [owner] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).uploadStakeHolder("teacher",2,["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"])).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should be able to upload stakeholders when contract is not paused",async function(){
        const [owner] = await ethers.getSigners();
        console.log('\t',"Attempting to upload stakeholders when contract is not paused.");
        paused = await votingContract.connect(owner).uploadStakeHolder("teacher",2,["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"]);
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
// describe("Show Categories of an Election...",function(){
//     it("Should not be able to show election categories when contract is paused",async function(){

//         const [owner,secondAddress] = await ethers.getSigners();
//         console.log('\t',"Attempting to Show Categories when contract is paused.");
//         //pause the contract
//         const paused = await votingContract.connect(owner).setPaused(true);
//        await expect(votingContract.connect(owner).showCategories()).to.be.revertedWith("Contract is currently paused");
//        console.log('\t',"Passed ....")
//        const unpaused = await votingContract.connect(owner).setPaused(false);
   
//     });
//     it("Should be able to show election categories when contract is unpaused",async function(){
//         const [owner,secondAddress] = await ethers.getSigners();
//         console.log('\t',"Attempting to Show Categories when contract is not paused.");
//         paused = await votingContract.connect(owner).showCategories();
        
//         expect(paused.length).to.be.greaterThanOrEqual(0);
//         console.log('\t',"Passed ...."); 
//     });
// })
///@notice test to Set up an Election.
describe("Set up Election...",function(){
    it("Should not be able to Set up an Election if caller is not the chairman or teacher",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Set up Election as a non chairman....");
        await expect(votingContract.connect(fourthAddress).setUpElection("president",[1,2],["chairman","teacher"])).to.be.revertedWith("Access granted to only the chairman or teacher");
        console.log('\t',"Passed ....");
    });
    it("Should be able to Set up an Election if caller is the chairman or teacher",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Set up Election when caller is the chairman.");
        setUpElection = await votingContract.connect(owner).setUpElection("president",[1,2],["chairman","teacher"]);
        const tx = await setUpElection.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ...."); 
   
    });
    it("Should only be able to Set up an Election when contract is not paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Set up Election when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).setUpElection("president",[1,2],["chairman","teacher"])).to.be.revertedWith("Contract is currently paused");
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
        setUpElection1 = await votingContract.connect(owner).setUpElection("president",[1,2],["chairman","teacher"]);

        const tx = await setUpElection1.wait();
        expect(tx.status).to.be.equal(1);
        startVotinsession = await votingContract.connect(owner).startVotingSession("president");
        const tx1 = await startVotinsession.wait();
        expect(tx1.status).to.be.equal(1);
        console.log('\t',"Passed ....");
    });
    
    it("Should not be able to Start Voting Session when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Start Voting Session when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).startVotingSession("president")).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should revert if category does not exist",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to start voting session for an unknown category.");
        await expect(votingContract.connect(owner).startVotingSession("local chairman")).to.be.revertedWith("no such category exist");
        console.log('\t',"Passed ....")
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
        setUpElection1 = await votingContract.connect(owner).setUpElection("president",[1,2],["chairman","teacher"]);

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
        clearElectionQueue = await votingContract.connect(owner).clearElectionQueue();
    });
    
})
///@notice test for Voting for a Category.
describe("Voting For a Candidate Category ...",function(){
    before(async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        addC = await votingContract.connect(owner).addCategories("headboy");
        setUpElection1 = await votingContract.connect(owner).setUpElection("president",[1,2],["chairman","teacher"]);
        const tx = await setUpElection1.wait();
        expect(tx.status).to.be.equal(1);
        setUpElection2 = await votingContract.connect(owner).setUpElection("headboy",[1,2],["teacher","student"]);
        const tx2 = await setUpElection2.wait();
        candidateCount = await votingContract.connect(owner).candidatesCount();
        console.log("candidate count. ",candidateCount)
        expect(tx2.status).to.be.equal(1);
        
    });
    it("Should not be able to  vote if caller is not Eligible to vote for a category",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        startVotinsession = await votingContract.connect(owner).startVotingSession("president");
        const tx1 = await startVotinsession.wait();
        expect(tx1.status).to.be.equal(1);
        console.log('\t',"Attempting to setup election.");
        console.log('\t',"Attempting to vote.");
        await expect(votingContract.connect(fourthAddress).vote("president",1)).to.be.revertedWith("You are not Qualified to vote for this category ");
        console.log('\t',"Passed ....");   
    });
    it("Should not be able to  vote if caller is not stakeholder",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote.");
        await expect(votingContract.connect(fifthAddress).vote("president",1)).to.be.revertedWith("You must be a registered stakeholder");
        console.log('\t',"Passed ....");   
    });
    
    it("Should not be able to vote when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote when contract is paused.");
       //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).vote("president",1)).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should not be able to vote when if voting has not commenced ",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote when voting has not commenced.");
    
       await expect(votingContract.connect(secondAddress).vote("headboy",3)).to.be.revertedWith("Voting has not commmenced for this Category");
       console.log('\t',"Passed ....")
      });
    it("Should not be able to vote if candidate is not registered for an office",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote for a candidate that is not registered for an office.");
    
       await expect(votingContract.connect(owner).vote("president",10)).to.be.revertedWith("Candidate is not Registered for this Office!");
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
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress] = await ethers.getSigners();
        // console.log("\t","Attempting to upload stakeholder as student");
        // uploadTeacher = await votingContract.connect(owner).uploadStakeHolder("teacher",2,[secondAddress.address]);
        // mintToAddress = await tokenContract.connect(owner).mint(secondAddress.address,ethers.utils.parseEther("10"));
        tb1= await tokenContract.balanceOf(secondAddress.address);
        console.log("balance teacher ==== ",tb1);
        console.log('\t',"Attempting to burn account balance.");
        transferBalance = await tokenContract.connect(secondAddress).transfer(owner.address,ethers.utils.parseEther("10"));
        console.log("Transferred..");
        console.log('\t',"Attempting to vote with a low balance.");
        await expect(votingContract.connect(secondAddress).vote("president",1)).to.be.revertedWith("YouR balance is currently not sufficient to vote. Not a stakeholder");
        console.log('\t',"Passed ....")
        mintToAddress = await tokenContract.connect(owner).mint(secondAddress.address,ethers.utils.parseEther("10"));
      
    });
    
    it("Should not be able to vote if voting has ended for a category",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        mintToAddress = await tokenContract.connect(owner).mint(secondAddress.address,ethers.utils.parseEther("10"));
        console.log('\t',"Attempting to when voting has ended for a category");
        endVotingSession = await votingContract.connect(owner).endVotingSession("president");
        stakeholder = await votingContract.connect(owner).stakeholders(secondAddress.address);
        console.log(stakeholder)
        await expect(votingContract.connect(secondAddress).vote("president",1)).to.be.revertedWith("Voting has ended for this Category");
        console.log('\t',"Passed ....")
    });
    
})
///@notice test for Get Winning Candidate for a Category.
describe("Get Winning Candidate for a Category ...",function(){
    
    it("Should not be able to Get Winning Candidate if votes has not been counted",async function(){
        const [owner,secondAddress] = await ethers.getSigners();

        console.log("\t","Attempting to get winning candidate when votes has not been counted");
        await expect(votingContract.connect(owner).getWinningCandidate("president")).to.be.revertedWith("Only allowed after votes have been counted");
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
    it("Should only be able to Get Winning Candidate when result is not made public",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log("\t","Attempting to get winning candidate when result has not been made public");
        await expect(votingContract.connect(owner).getWinningCandidate("president")).to.be.revertedWith("Result is not yet public");
        console.log('\t',"Passed ....");
    });
    it("Should only be able to Get Winning Candidate when result is  made public",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log("\t","Attempting to get winning candidate when contract is not paused");
         //end voting
         makeresultpublic = await votingContract.connect(owner).makeResultPublic("president");
        winningCandidate = await votingContract.connect(owner).getWinningCandidate("president");
        console.log("here winning candidate",winningCandidate)
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
        setUpElection = await votingContract.connect(owner).setUpElection("senate",[4,5],["chairman","teacher","student"]);
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
        setUpElection = await votingContract.connect(owner).setUpElection("counsellor",[6,7],["chairman","teacher","student"]);
        startVotingSession = await votingContract.connect(owner).startVotingSession("counsellor");
        firstVote = await  votingContract.connect(secondAddress).vote("counsellor",7);
        secondVote = await votingContract.connect(owner).vote("counsellor",6);
    })
    it("Should not be able to Make Election Result Public if caller is not the chairman",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to  Make Election Result Public if caller is not the chairman");
        await expect(votingContract.connect(fifthAddress).makeResultPublic("senate")).to.be.revertedWith("Access granted to only the chairman, teacher or director");
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
        await expect(votingContract.connect(fourthAddress).makeResultPublic("senate")).to.be.revertedWith("Access granted to only the chairman, teacher or director");
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
    it("Should be able to Make Election Result Public if caller is the director",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress] = await ethers.getSigners();
        console.log("\t","Attempting to  Make Election Result Public if caller is the director");
        addStakeholder = await votingContract.connect(owner).uploadStakeHolder("director",3,[eightAddress.address]);
        makeresultpublic = await votingContract.connect(eightAddress).makeResultPublic("senate");
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

///@notice test to get candidates
describe("Candidates for Elections",function(){
    it("Should be able to get candidates", async function(){
        //get signers
        const [owner] = await ethers.getSigners();    
        console.log("\t","Attempting to get Candidates...");     
        getCandidates = await votingContract.connect(owner).getCandidates();
        expect(getCandidates.length).to.be.greaterThan(1);
        console.log("passed...");
    }) 
})
// ///@notice test for showing queue
// describe("Show election Queue",function(){
//     it("Show not be able to show queue when contract is paused", async function(){
//         //get signers
//         const [owner] = await ethers.getSigners();
//         console.log('\t',"Attempting to pause the contract...");
//         paused = await votingContract.connect(owner).setPaused(true);
//         await expect(votingContract.connect(owner).showQueue()).to.be.revertedWith("Contract is currently paused");
//         unpaused =await votingContract.connect(owner).setPaused(false); 
//         console.log("passed..."); 
//     });
//     it("Show be able to show queue when contract is not paused", async function(){
//         //get signers
//         const [owner] = await ethers.getSigners();
//         console.log('\t',"Attempting to show queue...");
//         showQueue = await votingContract.connect(owner).showQueue();
//         expect(showQueue.length).to.be.greaterThan(1);
//         console.log("passed..."); 
//     });
// })

///@notice test for Changing Chairmanroles to stakeholders.
describe("Change Chairman role... and concensus voting",function(){
    before("Upload directors..",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
         //add address as a stakeholder
        //  addStakeholder = await votingContract.connect(owner).uploadStakeHolder("director",3,[eightAddress.address]);
         addStakeholder2 = await votingContract.connect(owner).uploadStakeHolder("director",3,[seventhAddress.address])
         addStakeholder3 = await votingContract.connect(owner).uploadStakeHolder("director",3,[tenthAddress.address])
       
    })
    it("Should not be able to Change Chairman role if caller is not a director",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change Chairman role as a non director....");
        await expect(votingContract.connect(secondAddress).changeChairman(secondAddress.address)).to.be.revertedWith("Only Directors have access");
        console.log('\t',"Passed ....");
    });
   
    it("Should revert if address is a non stakeholder",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change Chairman role to a non stakeholder....");
        await expect(votingContract.connect(eightAddress).changeChairman(ninthAddress.address)).to.be.revertedWith("Can't assign a role of chairman to a non stakeholder.")
        addStakeholder1 = await votingContract.connect(owner).uploadStakeHolder("director",3,[ninthAddress.address]) 
        console.log('\t',"Passed ....");
    });
    it("Should revert if consensus is less than 75% from the directors",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change Chairman role when consensus is less than 75% from the directors");
        await expect(votingContract.connect(eightAddress).changeChairman(ninthAddress.address)).to.be.revertedWith("Requires Greater than 75% consent of Directors to approve!") 
        console.log('\t',"Passed ....");
    });
    it("Should revert when contract is paused",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change Chairman role when contract is paused....");
        const paused = await votingContract.connect(owner).setPaused(true);
        await expect(votingContract.connect(eightAddress).changeChairman(seventhAddress.address)).to.be.revertedWith("Contract is currently paused");
        const unpaused = await votingContract.connect(owner).setPaused(false);
        console.log('\t',"Passed ....");
    
    });
    it("Should revert if voter for a consensus is not a director",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote for a consensus as a non director....");
        await expect(votingContract.connect(secondAddress).changeChairman(seventhAddress.address)).to.be.revertedWith("Only Directors have access");
        console.log('\t',"Passed ....");
    
    });
    it("Should revert if director has already giving consent(no duplicate consent)",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to give consent twice....");
        //consent by directors
        consent1 = await votingContract.connect(eightAddress).concensusVote();
        await expect(votingContract.connect(eightAddress).concensusVote()).to.be.revertedWith("You have already consented..");
        console.log('\t',"Passed ....");
        consent2 = await votingContract.connect(seventhAddress).concensusVote();
        consent3 = await votingContract.connect(ninthAddress).concensusVote();
        consent4 = await votingContract.connect(tenthAddress).concensusVote();
       
    });
    it("Should be able to Change Chairman role if caller is a director and a concensus have been reached...",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change Chairman role as a chairman....");
        changeChairman =await votingContract.connect(eightAddress).changeChairman(eightAddress.address);
        const tx = await changeChairman.wait();
        expect(tx.status).to.equal(1);
        newChairman = await votingContract.connect(owner).chairman();
        expect(newChairman).to.equal(eightAddress.address);
        console.log('\t',"Passed ....");
    });
})
