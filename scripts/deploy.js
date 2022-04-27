//implement ethers from hardhat
const{ethers} = require("hardhat");

async function main(){
     /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so ZurischoolContract here is a factory for instances of our ZuriSchool contract.
  */
 
  console.log("deploying ZuriSchoolToken contract.......")
    const ZSTokenContract = await ethers.getContractFactory("ZuriSchoolToken");

    // here we deploy the contract
    const deployedZSTokenContract = await ZSTokenContract.deploy();

    // Wait for it to finish deploying
  await deployedZSTokenContract.deployed();

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
    deployedZuriSchoolContract.address
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
