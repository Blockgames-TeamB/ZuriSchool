import React, {useState, useContext, useEffect} from 'react';
import { Link } from 'react-router-dom';



import Header from '../partials/Header';
import Sidebar from "../components/Sidebar"
import { ConnectContext } from "../context/ConnectContext";

function DirectorPortal() {
  const {
   
    Compile,
    publish,
    
    
    
    electionList,
  } = useContext(ConnectContext);

 

 

  const [activeElection, setactiveElection] = useState([]);
  

  // a boolean state to allow that only one of upload file button and upload button show at a time

  //fetchCategory,AddCategory
  

  const fetch = async () => {
    const result = await electionList();
    setactiveElection(result);
  };

  useEffect(() => {
    fetch();
  },[candidateID]);

  useEffect(() => {
    let ZuriSchoolContract;
  
    const onStakeholderRegisteredEvent = () => {
     notify("StakeHolders have been added")
    
    };
    
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      ZuriSchoolContract = new ethers.Contract(contractAddress, contractABI, signer);
      ZuriSchoolContract.on("StakeholderRegisteredEvent", onStakeholderRegisteredEvent);
    }
    
  
    return () => {
      if (ZuriSchoolContract) {
        ZuriSchoolContract.off("StakeholderRegisteredEvent", onStakeholderRegisteredEvent);
      }
    };
  }, []);
  useEffect(() => {
    let ZuriSchoolContract;
  
    const onCandidateRegisteredEvent = () => {
     notify("Candidate have been registered")
    
    };
    
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      ZuriSchoolContract = new ethers.Contract(contractAddress, contractABI, signer);
      ZuriSchoolContract.on("CandidateRegisteredEvent", onCandidateRegisteredEvent);
    }
   
  
    return () => {
      if (ZuriSchoolContract) {
        ZuriSchoolContract.off("CandidateRegisteredEvent", onCandidateRegisteredEvent);
      }
    };
  }, []);
  
  
 

  return (
    <div id="outer-container">
      <Sidebar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
      <div
        className="flex flex-col min-h-screen overflow-hidden"
        id="page-wrap"
      >
        {/*  Site header */}
        <Header />

        {/*  Page content */}
        <main className="flex-grow">
          <section className="bg-gradient-to-b from-gray-100 to-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                {/* Page header */}
                <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                  <h1 className="h1">Welcome Director</h1>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
                  <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                    <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                      <svg
                        width="30"
                        height="30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl"></p>
                      <p>Students</p>
                    </div>
                  </div>
                  <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                    <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                      <svg
                        width="30"
                        height="30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl"></p>
                      <p>Teachers</p>
                    </div>
                  </div>
                  <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                    <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                      <svg
                        width="30"
                        height="30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl"></p>
                      <p>Directors</p>
                    </div>
                  </div>
                  <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                    <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                      <svg
                        width="30"
                        height="30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl">{activeElection.length}</p>
                      <p>Election</p>
                    </div>
                  </div>
                </div>

                

              

               

               

                

               

              
            
        {/* <!-- ./Client Table --> */}
              
              
        {/* <!-- Client Table --> */}
        { activeElection.length>0 ?
        <div class="mt-4 mx-4">
        <div class="md:col-span-2 xl:col-span-3">
            <h3 class="text-lg font-semibold">ACTIVE ELECTION</h3>
          </div>
          <div class="w-full overflow-hidden rounded-lg shadow-xs">
            <div class="w-full overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th class="px-4 py-3">Position</th>
                    <th class="px-4 py-3">No of Candidates</th>
                    <th class="px-4 py-3">Action</th>
                   
                  </tr>
                </thead>
                <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">

               
                  {activeElection.map((election, key)=>{
                 
                      if(election.VotingEnded==true){
                        return (
                          <tr class="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400" id={key}>
                    <td class="px-4 py-3">
                      <div class="flex items-center text-sm">
                        
                        <div>
                          <p class="font-semibold">{(election.category).toString()}</p>
                         
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm">{election.candidatesID.length}</td>
                    <td class="px-4 py-3 text-xs">
            

                      {!election.VotesCounted
              ? <span
              class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100 cursor-pointer"
              onClick={() =>
                Compile(election.category)
              }
            >
            
              Compile Votes{" "}
            </span>
              : !election.isResultPublic ? (
                <span
                  class="px-2 py-1 font-semibold leading-tight text-white-700 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-red-700 cursor-pointer"
                  onClick={() =>
                    publish(
                      election.category.toString()
                    )
                  }
                >
                
                  Publicize Result{" "}
                </span>
              
            
         )   : (
                <span class="px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-red-700"> Election Over </span>
              )}
                
                     
                    </td>
                    
                  </tr>
                        )
                      }
                      
                    
            
                  })}
                  
                 
                
                </tbody>
              </table>
            </div>
            <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
            
              <span class="col-span-2"></span>
              {/* <!-- Pagination --> */}
              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul class="inline-flex items-center">
                   
                   
                    
                    
                  </ul>
                </nav>
              </span>
            </div>
          </div>
        </div>
        :(<></>)}
              </div>
              </div>

           
        
        </section>

      </main>

    </div> </div>
  );
}


export default DirectorPortal;