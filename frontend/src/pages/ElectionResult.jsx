import React, {useContext, useState, useEffect} from 'react';

import Header from '../partials/Header';
import Sidebar from "../components/Sidebar"
import { ConnectContext } from "../context/ConnectContext";
function ElectionResult() {
  const { electionList, getResult } = useContext(ConnectContext);
  const [activeElection, setactiveElection] = useState([])
  const [winner, setwinner] = useState([])
  const [showModal, setshowModal] = useState(false);
  const [cat2String, setcat2String] = useState("");
  
  const fetch= async()=>{
    const result = await electionList()
    setactiveElection(result)
  }
  const fetchResult= async(e, _category)=>{
    e.preventDefault();
    const result = await getResult(_category)
    setcat2String(_category)
    setwinner(result)
    console.log(result)
    setshowModal(true)
  }

  useEffect(()=>{
fetch()

  })
  
  return (
    <div id="outer-container">
    <Sidebar pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } />
    <div className="flex flex-col min-h-screen overflow-hidden" id="page-wrap">

      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">

        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">

              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1">View Election Result</h1>
              </div>

              {/* Form */}
              {/* <!-- Task Summaries --> */}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-4 gap-4 text-black dark:text-white">
          
          {activeElection.map((election, key)=>{

            if(election.isResultPublic) {
              return (
                <div class="md:col-span-2 xl:col-span-1" key={key} >
              <div class="rounded bg-gray-200 dark:bg-gray-800 p-3">
                <div class="flex justify-between py-1 text-black dark:text-white">
                  <h3 class="text-sm font-semibold">{(election.category).toUpperCase()}</h3>
                  <svg class="h-4 fill-current text-gray-600 dark:text-gray-500 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 10a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4z" /></svg>
                </div>
                <div class="text-sm text-black dark:text-gray-50 mt-2">
                 
  <div id={key} class="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded mt-1 border-b border-gray-100 dark:border-gray-900 cursor-pointer">
                    
                    <div class="flex items-center text-sm">
                    
                         
                         <div>
                          Result is ready
                          
                         </div>
                       </div></div>
                    
                  
  
                   
                        
         
                  
         
                </div>
                  
  
                   
                      
                  
                  
                 
                       <button
      type="button"
      data-mdb-ripple="true"
      data-mdb-ripple-color="light"
      class="inline-block mt-5 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out cursor-printer" onClick={(e)=>
        { fetchResult(e, election.category)
         
        }}
    >Veiw Result </button>
                </div>
              </div>
           
              )
            }
            else {
              return (
                <div class="md:col-span-2 xl:col-span-1" id={key} >
              <div class="rounded bg-gray-200 dark:bg-gray-800 p-3">
                <div class="flex justify-between py-1 text-black dark:text-white">
                  <h3 class="text-sm font-semibold">{(election.category).toUpperCase()} POSITION</h3>
                  <svg class="h-4 fill-current text-gray-600 dark:text-gray-500 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 10a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4z" /></svg>
                </div>
                <div class="text-sm text-black dark:text-gray-50 mt-2">
                 
  <div id={key} class="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded mt-1 border-b border-gray-100 dark:border-gray-900 cursor-pointer">
                    
                    <div class="flex items-center text-sm">
                    
                         
                         <div>
                          Kindly Await Result.
                          
                         </div>
                       </div></div>
                    
                  
  
                   
                        
                  
                  
                  
         
                </div>
              </div>
            </div>
              )
            }
            
          }) }
          
         
        </div>
        {/* <!-- ./Task Summaries --> */}

        {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Winner!!!
                  </h3>
                  
                </div>
                {/*body*/}
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex justify-end p-2">
                
            </div>
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
  


    <div class="border-t border-gray-200">
    <dl>
      <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Candidate ID: </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{winner[0].id.toNumber()}</dd>
      </div>
      <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Name: </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{winner[0].name}</dd>
      </div>
      <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Position Contested: </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{cat2String}</dd>
      </div>
      <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Votes Earned: </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{winner[0].voteCount.toNumber()}</dd>
      </div>
      <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Total Casted Votes: </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{winner[1].toNumber()}</dd>
      </div>
      
     
    </dl>
  </div>
  
</div>
        </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setshowModal(false)}
                  >
                    Close
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

            </div>
          </div>
        </section>

      </main>

    </div></div>
  );
}

export default ElectionResult;