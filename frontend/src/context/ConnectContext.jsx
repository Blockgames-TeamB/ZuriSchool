import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
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

 
const notify = (str) => toast(str);

const upload = async(_role, votingWeight,Arr) => {
  const contract = createEthereumContract();
  notify("uploading stakeholders");
 try {
   const result =await contract.uploadStakeHolder(_role, votingWeight, Arr, {gasLimit:600000});
   notify("stakeholders, uploaded");
  return result
  }
 catch(error){
  notify("error, check console");
   console.log(error)
 
 }
}
const setupElection = async(_category, idArr, allowanceArr) => {
  const contract = createEthereumContract();
  notify("setting up election");
 try {
   const result =await contract.setUpElection(_category, idArr, allowanceArr, {gasLimit:300000});
   notify("election is ready for approval");
  return result
  }
 catch(error){
   console.log(error)
   notify("error, check console");
 
 }
}
const mint = async(role, amount, Arr) => {
  const contract = createEthereumContractToken();
  notify("minting...");
 try {
   const result =await contract.mintToStakeholder(role, amount, Arr, {gasLimit:300000});
   notify("minting, successful");
  return result
  }
 catch(error){
  notify("error, check console");
   console.log(error)
 
 }
}
const changeTokenChairman = async(addr) => {
  const contract = createEthereumContractToken();
  notify("changing chairman in token...");
 try {
   const result =await contract.changeChairman(addr);
   notify("changed token chairman");
  return result
  }
 catch(error){
  notify("error, check console");
   console.log(error)
 
 }
}
const clear = async() => {
  const contract = createEthereumContract();
  
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
  notify(error);
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
  notify("publishing, result");
 try {
   const result =await contract.makeResultPublic(_category, {gasLimit:600000});
   notify("result, published");
  return result
  }
 catch(error){
  notify("error, check console");
   console.log(error)
 
 }
}

const RegisterCandidate = async(name, _category) => {
  const contract = createEthereumContract();
  notify("registering candidate");
 try {
   const result =await contract.registerCandidate(name, _category, {gasLimit:300000});
   notify("candidate added");
  return result
  }
 catch(error){
  notify("error, check console");
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
  notify("adding category");
 try {
   const result =await contract.addCategories(_category);
   
   notify("category added");

  return result
  }
 catch(error){
  notify("error check console");
   console.log(error)
 
 }
}
const updateChairman = async(addr) => {
  const contract = createEthereumContract();
  notify("changing chairman in zurischool...");
 try {
   const result =await contract.changeChairman(addr);
   if(result){
    await changeTokenChairman(addr)
  }
   notify("changing chairman in zurischool...");

  return result
  }
 catch(error){
   notify("error, check console")
   console.log(error)
 
 }
}
const voteConsensus = async() => {
  const contract = createEthereumContract();
  notify("voting for consensus")
 try {
   const result =await contract.concensusVote();
   
   notify("You have consented")

  return result
  }
 catch(error){
  notify("error, check console")
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
  notify("compiling result for " + _category);
 try {
   const result =await contract.compileVotes(_category, {gasLimit:300000} );
   notify( _category + " election has been added");
  return result
  }
 catch(error){
  notify("error, check console");
   console.log(error)
  
 }
}
const Voting = async(_category, id) => {
  const contract = createEthereumContract();
  notify("Voting...");
 try {
   const result =await contract.vote(_category, id, {gasLimit:300000});
   notify("Voting is successful for " + _category );
  return result
  }
 catch(error){
  notify("error, check console");
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
          updateChairman,
          voteConsensus
        }}
      >
        {children}
      </ConnectContext.Provider>
    );
  };