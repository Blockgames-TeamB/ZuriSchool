//implement ethers from hardhat
const{ethers} = require("hardhat");

async function main(){
     /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so zuriSchool token here is a factory for instances of our zuriSchool contract.
  */
 console.log("deploying ZuriSchoolToken contract.......")
    const ZuriTokenContract = await ethers.getContractFactory("ZuriSchoolToken");
    const [owner] = await ethers.getSigners();
     // here we deploy the contract
    const deployedZuriTokenContract = await ZuriTokenContract.connect(owner).deploy();

    // Wait for it to finish deploying
  await deployedZuriTokenContract.deployed();

  // print the address of the deployed contract
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
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
