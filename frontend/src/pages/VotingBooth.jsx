import React,{useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';


import Header from '../partials/Header';
import Sidebar from "../components/Sidebar"
import { ConnectContext } from "../context/ConnectContext";
function VotingBooth() {
  const { electionList, Voting, candidateList } = useContext(ConnectContext);
  const [activeElection, setactiveElection] = useState([])
  const [arr, setarr] = useState([])
  const [choice, setChoice] = useState()
  // const [cnumber1, setcnumber1] = useState("")
  // const [cnumber2, setcnumber2] = useState("")
  // const [cnumber3, setcnumber3] = useState("")
  // const [count, setCount] = useState()
 
  const fetch= async()=>{
    const result = await electionList()
    setactiveElection(result)
    
  }
  const fetchCandidate= async()=>{
    const result = await candidateList()
  
    setarr(result)
    
  }
  // const Name= await candidateName(id)
  

  
   
   
   
 
 
  useEffect(()=>{
fetch()
fetchCandidate()

  })
  useEffect(()=>{

fetchCandidate()

  },[activeElection])
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
                <h1 className="h1">Vote Wisely!</h1>
              </div>

              {/* Form */}
              {/* <!-- Task Summaries --> */}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-4 gap-4 text-black dark:text-white">
          <div class="md:col-span-2 xl:col-span-3">
            <h3 class="text-lg font-semibold">Ongoing Elections</h3>
          </div>
          {activeElection.map((election, key)=>{

            

            if(!election.VotingEnded) {
              return (
                <div class="md:col-span-2 xl:col-span-3" key={key} >
              <div class="rounded bg-gray-200 dark:bg-gray-800 p-3">
                <div class="flex justify-between py-1 text-black dark:text-white">
                  <h3 class="text-sm font-semibold">{(election.category).toUpperCase()}</h3>
                  <svg class="h-4 fill-current text-gray-600 dark:text-gray-500 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 10a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4z" /></svg>
                </div>
                <div class="text-sm text-black dark:text-gray-50 mt-2">
                  {election.candidatesID.map((id, key)=>{
                  
             
                  
                  
                   
                   
                    return(
  <div key={key} class="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded mt-1 border-b border-gray-100 dark:border-gray-900 cursor-pointer">
                    
                    <div class="flex items-center text-sm">
                    <div className='pr-4'>
                         <input id="push-everything" name="push-notifications" type="radio" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" value={id} onChange={(e)=>{setChoice(e.target.value)
                        console.log(e.target.value)}}/>
                          
                         </div>{""} 
                         <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                           <img class="object-cover w-full h-full rounded-full" src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=200&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjE3Nzg0fQ" alt="" loading="lazy" />
                           <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true">
                          
                           </div>
                         </div> 
                          
                           <div>
                         {arr.map((candy, key)=>
                         {
                          if(key+1==id) {
                            return candy.name
                          }
                         })}
                         </div>
                         
                         
                        

                       </div></div>
                    )
                  })}
  
                   
                        
                  
                  
                  
                 
                       <button
      type="button"
      data-mdb-ripple="true"
      data-mdb-ripple-color="light"
      class="inline-block mt-5 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out cursor-printer" onClick={()=>Voting(election.category, choice)}
    >Vote </button>
                </div>
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
                         Election Ended, Kindly Await Result.
                          
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

            </div>
          </div>
        </section>

      </main>

    </div></div>
  );
}

export default VotingBooth;