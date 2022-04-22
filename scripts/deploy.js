//implement ethers from hardhat
const{ethers} = require("hardhat");

async function main(){
       /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so ZuriSchoolContract here is a factory for instances of our ZuriSchool contract.
  */
  // console.log("deploying ZuriSchool contract")
  //   const ZurischooltokenContract = await ethers.getContractFactory("ZuriSchoolToken");
  //   // here we deploy the contract
  //   const deployedZuriSchoolTokenContract = await ZurischooltokenContract.deploy();

  //   // Wait for it to finish deploying
  //   await deployedZuriSchoolTokenContract.deployed();


    const ZuriTokenContract = await ethers.getContractFactory("ZuriSchool");
    const [owner] = await ethers.getSigners();
  //   // here we deploy the contract
    const deployedZuriTokenContract = await ZuriTokenContract.connect(owner).deploy();

  //   // Wait for it to finish deploying
  //   await deployedZuriSchoolContract.deployed();

  
    const ZuriSchoolToken = ethers.getContractFactory("ZuriSchoolToken");
    const zurischooltoken = await ZuriSchoolToken.deploy

    await zurischooltoken.deployed();

    const ZuriSchool = ethers.getContractFactory("ZuriSchool");
    const zurischool = await ZuriSchool.deploy

    await zurischool.deployed();

    console.log("ZuriSchoolToken deployed to:", zurischooltoken.address);    
    console.log("ZuriSchool deployed to:", zurischool.address);




  // // print the address of the deployed contract
  // console.log(
  //   "\n 🏵 ZuriSchoolToken Contract Address:",
  //   deployedZuriSchoolTokenContract.address
  // );
  // console.log(
  // "\n 🏵 ZuriSchool Contract Address:",
  //   deployedZuriSchoolContract.address
  //   );
}





// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
