//implement ethers from hardhat
const{ethers} = require("hardhat");

async function main(){
     /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
<<<<<<< HEAD
  so ZurischoolContract here is a factory for instances of our ZuriSchool contract.
  */
 
  console.log("deploying ZuriSchoolToken contract.......")
    const ZSTokenContract = await ethers.getContractFactory("ZuriSchoolToken");

    // here we deploy the contract
    const deployedZSTokenContract = await ZSTokenContract.deploy();

    // Wait for it to finish deploying
  await deployedZSTokenContract.deployed();
=======
  so zuriSchool token here is a factory for instances of our zuriSchool contract.
  */
 console.log("deploying ZuriSchoolToken contract.......")
    const ZuriTokenContract = await ethers.getContractFactory("ZuriSchoolToken");
    const [owner] = await ethers.getSigners();
     // here we deploy the contract
    const deployedZuriTokenContract = await ZuriTokenContract.connect(owner).deploy();

    // Wait for it to finish deploying
  await deployedZuriTokenContract.deployed();
>>>>>>> 5d30a4e470edfa73951c9383ac75ec3ddc0a846d

     /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so ZurischoolContract here is a factory for instances of our ZuriSchool contract.
  */
 console.log("deploying ZuriSchool contract.......")
 const ZurischoolContract = await ethers.getContractFactory("ZuriSchool");

 // here we deploy the contract
//  const deployedZuriSchoolContract = await ZurischoolContract.deploy(deployedZuriSchoolContract.address);
 const deployedZuriSchoolContract = await ZurischoolContract.deploy();

 // Wait for it to finish deploying
await deployedZuriSchoolContract.deployed();

// print the address of the deployed ZuriSchoolToken contract
console.log(
  "\n 🏵 ZuriSchoolToken Contract Address:",
  deployedZSTokenContract.address
);

  // print the address of the deployed ZuriSchool contract
  console.log(
    "\n 🏵 ZuriSchool Contract Address:",
    deployedZuriTokenContract.address
  );

 console.log("deploying ZuriVoting contract.......")
    const ZuriVotingContract = await ethers.getContractFactory("ZuriSchool");
     // here we deploy the contract
    const deployedZuriVotingContract = await ZuriVotingContract.connect(owner).deploy(deployedZuriTokenContract.address);

    // Wait for it to finish deploying
  await deployedZuriVotingContract.deployed();

  // print the address of the deployed contract
  console.log(
    "\n 🏵 ZuriSchool Contract Address:",
    deployedZuriVotingContract.address
  );

  // console.log("\n 🏵  Transfering ownership of ZuriSchoolToken to ZuriSchool ...\n");

  // // Transfer ownership of ZuriSchoolToken to ZuriSchool
  // // const ownershipTransaction = await zstoken.transferOwnership(zurischool.address);
  // await deployedZSTokenContract.transferOwnership(deployedZuriSchoolContract.address);

  // console.log("\n    ✅ confirming ownership transfer...\n");
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
