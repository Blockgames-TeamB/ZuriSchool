import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";
import { contractABIToken, contractAddressToken } from "../utils/tokenConstants";

export const ConnectContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const zuriSchoolContract = new ethers.Contract(contractAddress, contractABI, signer);
 
  return zuriSchoolContract;
};
const createEthereumContractToken = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const zuriTokenContract = new ethers.Contract(contractAddressToken, contractABIToken, signer);
 
  return zuriTokenContract;
};

 


const upload = async(_role, votingWeight,Arr) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.uploadStakeHolder(_role, votingWeight, Arr, {gasLimit:600000});
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}
const setupElection = async(_category, idArr) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.setUpElection(_category, idArr, {gasLimit:300000});
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}
const mint = async(role, amount, Arr) => {
  const contract = createEthereumContractToken();
  
 try {
   const result =await contract.mintToStakeholder(role, amount, Arr, {gasLimit:300000});

  return result
  }
 catch(error){
   console.log(error)
 
 }
}
const clear = async() => {
  const contract = createEthereumContractToken();
  
 try {
  await contract.clearElectionQueue();

 
  }
 catch(error){
   console.log(error)
 
 }
}

const startVoting = async(_category) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.startVotingSession(_category, {gasLimit:600000});
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}
const endVoting = async(_category) => {
  const contract = createEthereumContract();
  
 try {
  await contract.endVotingSession(_category, {gasLimit:600000});
 
  }
 catch(error){
   console.log(error)
 
 }
}
const publish = async(_category) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.makeResultPublic(_category, {gasLimit:600000});
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}

const RegisterCandidate = async(name, _category) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.registerCandidate(name, _category, {gasLimit:300000});
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}
const candidateName = async(id) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.getCandidateName(id, {gasLimit:300000});
  //  console.log(result)
  return result
  }
 catch(error){
   console.log(error)
 
 }
}
const AddCategory = async(_category) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.addCategories(_category);
   
  

  return result
  }
 catch(error){
   console.log(error)
 
 }
}
const updateChairman = async(addr) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.changeChairman(addr);
   
  

  return result
  }
 catch(error){
   console.log(error)
 
 }
}

const electionList = async() => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.fetchElection();
  
  return result
  }
 catch(error){
   console.log(error)
  
 }
}
const candidateList = async() => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.getCandidates();
  
  return result
  }
 catch(error){
   console.log(error)
  
 }
}

const Compile = async(_category) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.compileVotes(_category, {gasLimit:300000} );
  
  return result
  }
 catch(error){
   console.log(error)
  
 }
}
const Voting = async(_category, id) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.vote(_category, id, {gasLimit:300000});
  
  return result
  }
 catch(error){
   console.log(error)
  
 }
}
const getResult = async(_category) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.getWinningCandidate(_category);
  
  return result
  }
 catch(error){
   console.log(error)
  
 }
}
const check = async(role, addr) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.checkRole(role, addr);
  
  return result
  }
 catch(error){
   console.log(error)
  
 }
}

const pauseContract = async(value) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.setPaused(value);
  
  return result
  }
 catch(error){
   console.log(error)
  
 }
}


export const ConnectProvider = ({ children }) =>{
    const [currentAccount, setCurrentAccount] = useState("");
    const [networkConnected, setnetworkConnected] = useState("");
    const checkIfWalletIsConnect = async () => {
      
      try {
        if (!ethereum) return alert("Please install MetaMask.");
       // const provider = new ethers.providers.Web3Provider(ethereum);
        const accounts = await ethereum.request({ method: "eth_accounts" });
  
        if (accounts.length) {
        //  setCurrentAccount(await provider.lookupAddress(accounts[0]));
        setCurrentAccount(accounts[0]);
      
        } else {
          console.log("No accounts found");
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    const findNetwork = async() => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const network = await provider.getNetwork();
       const chainId = network.chainId;

       if (chainId ==1) {setnetworkConnected("Mainnet")}
       if (chainId ==3) {setnetworkConnected("Ropsten")}
       if (chainId ==4) {setnetworkConnected("Rinkeby")}
       if (chainId ==5) {setnetworkConnected("Goerli")}
       if (chainId ==137) {setnetworkConnected("Polygon")}
       if (chainId ==80001) {setnetworkConnected("Mumbai")}
      
      
      
   
      };
    
    
  
    const connectWallet = async () => {
     
      try {
       
        if (!ethereum) return alert("Please install MetaMask.");
  
        const accounts = await ethereum.request({ method: "eth_requestAccounts", });
        
  
        setCurrentAccount(accounts[0]);
        
        
        window.location.reload();
      } catch (error) {
        console.log(error);
  
        throw new Error("No ethereum object");
      }
    };

    useEffect(() => {
      checkIfWalletIsConnect();
    findNetwork()
     
    }, []);

   
 
    return (
      <ConnectContext.Provider
        value={{
          
          connectWallet,
          currentAccount,
          networkConnected,
          setupElection,
          RegisterCandidate,
          AddCategory,
          startVoting,
          endVoting,
          Compile,
          publish,
          upload,
          clear,
          Voting,
          getResult,
          electionList,
          check,
          candidateName,
          pauseContract,
          candidateList,
          mint,
          updateChairman
        }}
      >
        {children}
      </ConnectContext.Provider>
    );
  };