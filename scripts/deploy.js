//implement ethers from hardhat
const{ethers} = require("hardhat");

async function main(){
     /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so NestcoinContract here is a factory for instances of our Nestcoin contract.
  */
 console.log("deploying ZuriSchool contract.......")
    const ZurischoolContract = await ethers.getContractFactory("ZuriSchool");

    // here we deploy the contract
    const deployedZuriSchoolContract = await ZurischoolContract.deploy();

    // Wait for it to finish deploying
  await deployedZuriSchoolContract.deployed();

  // print the address of the deployed contract
  console.log(
    "\n 🏵 ZuriSchool Contract Address:",
    deployedZuriSchoolContract.address
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
