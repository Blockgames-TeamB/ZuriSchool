import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const ConnectContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const zuriSchoolContract = new ethers.Contract(contractAddress, contractABI, signer);
 
  return zuriSchoolContract;
};


const upload = async(_role, Arr) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.uploadStakeHolder(_role, Arr, {gasLimit:300000});
  
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
const electionQueue = async() => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.showQueue();
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}
const startVoting = async(_category) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.startVotingSession(_category, {gasLimit:300000});
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}
const endVoting = async(_category) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.endVotingSession(_category);
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}
const publish = async(_category) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.makeResultPublic(_category);
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}
const clear = async() => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.clearElectionQueue();
  
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
const AddCategory = async(_category) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.addCategories(_category, {gasLimit:300000});
  
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
const fetchCategory = async() => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.showCategories();
  
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
const checkChairman = async(addr) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.isChairman(addr);
  
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
          fetchCategory,
          RegisterCandidate,
          AddCategory,
          electionQueue,
          startVoting,
          endVoting,
          Compile,
          publish,
          upload,
          clear,
          Voting,
          getResult,
          electionList,
          checkChairman,
          pauseContract
        }}
      >
        {children}
      </ConnectContext.Provider>
    );
  };