import React, {useState, useContext, useEffect} from 'react';
import { Link } from 'react-router-dom';



import Header from '../partials/Header';
import Sidebar from "../components/Sidebar"
import { ConnectContext } from "../context/ConnectContext";

function TeacherPortal() {

  const {fetchCategory, AddCategory, setupElection, RegisterCandidate, electionQueue, upload} = useContext(ConnectContext);

  const [showStudModal, setshowStudModal] = useState(false);
  const [showDirModal, setshowDirModal] = useState(false);
  const [showTchModal, setshowTchModal] = useState(false);
  const [selectCategory, setselectCategory] = useState("");
  const [showSetElectModal, setshowSetElectModal] = useState(false);
  const [showElectCategoryModal, setshowElectCategoryModal] = useState(false);
  const [showRegCandidateModal, setRegCandidateModal] = useState(false);

  const [Addresses, setAddresses] = useState([]);
  const [Category, setCategory] = useState("");
  const [candidateID, setcandidateID] = useState("");
  const [candidateName, setcandidateName] = useState("");
  const [Queue, setQueue] = useState([]);
  const [CategoryList, setCategoryList] = useState([]);
 
  // a boolean state to allow that only one of upload file button and upload button show at a time

  //fetchCategory,AddCategory
   const [isFileUpload, setisFileUpload] = useState(false);


   // function to convert csv file from input file to arr, it receives a str paramater
  const csvToArray = (str) => {
    // split arrays the file according to \n newline regex
   // const firstArr = str.split("\n");
   const arr = str.split("\r\n");
   
 
 
   
  console.log(arr)
    return arr;
  };

  // function to handle uploading file and getting initial readings
 
  function handleUpload(e, role, arr) {
    e.preventDefault();
    // input file tag is is cvsFile
  upload(role, arr) 
  
      

    };

 

  
  function handleChange(e) {
    e.preventDefault();
    // input file tag is is cvsFile
  
   // const csvFile = document.getElementById("csvFile");
   const input = e.target.files[0];
    // reading the file
    const reader = new FileReader();

    reader.onload = function(e) {
      const text = e.target.result;
      // calling our csvToArray(str) to convert to array
      // data here is like our secondArray earlier
      const data = csvToArray(text);

      // setisFileUpload to true as we've uploaded our file
      setisFileUpload(true);

      // update ourAddresses array
      setAddresses(data);

 
      

    };

    reader.readAsText(input);

  };
   
  
const setupElect =async(e)=>{
  e.preventDefault();
  const arr = candidateID.split(',');

await setupElection(selectCategory, arr)
}




const RegCandidate =async(e)=>{
  e.preventDefault();
  
  console.log(candidateName, selectCategory)
await RegisterCandidate(candidateName, selectCategory)

setselectCategory("")
setcandidateName("")
}

const handleCategory =async(e)=>{
  e.preventDefault();
await AddCategory(Category)
}

const showCategoryList =async()=>{

 const list = await fetchCategory()

 setCategoryList(list)
  }
const showQueueList =async()=>{

 const list = await electionQueue()

 setQueue(list)

  }

useEffect(()=>{
showCategoryList();
showQueueList()

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
                <h1 className="h1">Welcome Teacher</h1>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
          <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
            <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div class="text-right">
              <p class="text-2xl"></p>
              <p>Students</p>
            </div>
          </div>
          <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
            <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div class="text-right">
              <p class="text-2xl"></p>
              <p>Teachers</p>
            </div>
          </div>
          
          
        </div>

        {/* <!-- Task Summaries --> */}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 p-4 gap-4 text-black dark:text-white">
          <div class="md:col-span-2 xl:col-span-2">
            <h3 class="text-lg font-semibold">What To Do?</h3>
          </div>
         
          <div>
            <div class="rounded bg-gray-200 dark:bg-gray-800 p-3">
              <div class="flex justify-between py-1 text-black dark:text-white">
                <h3 class="text-sm font-semibold">Electoral Functions</h3>
                <svg class="h-4 fill-current text-gray-600 dark:text-gray-500 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 10a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4z" /></svg>
              </div>
              <div class="text-sm text-black dark:text-gray-50 mt-2">
                
              <div class="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded mt-1 border-b border-gray-100 dark:border-gray-900 cursor-pointer" onClick={()=>setshowElectCategoryModal(true)}>Add Election Category</div>
                <div class="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded mt-1 border-b border-gray-100 dark:border-gray-900 cursor-pointer" onClick={()=>setshowSetElectModal(true)}>Setup Election</div>
                <div class="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded mt-1 border-b border-gray-100 dark:border-gray-900 cursor-pointer" onClick={() => setRegCandidateModal(true)}>Register Candidates</div>
                
               

                
                
              </div>
            </div>

           
          </div>
          <div>
          <div class="rounded bg-gray-200 dark:bg-gray-800 p-3">
              <div class="flex justify-between py-1 text-black dark:text-white">
                <h3 class="text-sm font-semibold">Admins</h3>
                <svg class="h-4 fill-current text-gray-600 dark:text-gray-500 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 10a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4z" /></svg>
              </div>
              <div class="text-sm text-black dark:text-gray-50 mt-2">
                <div class="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded mt-1 border-b border-gray-100 dark:border-gray-900 cursor-pointer" onClick={() => setshowStudModal(true)}>Register Students</div>
                <div class="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded mt-1 border-b border-gray-100 dark:border-gray-900 cursor-pointer" onClick={() => setshowTchModal(true)}>Register Teachers</div>
                
                <div class="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded mt-1 border-b border-gray-100 dark:border-gray-900 cursor-pointer" onClick={() => setshowDirModal(true)}> Register Board of Directors</div>
                
               
                
              </div>
            </div>

          </div>
        </div>
        {/* <!-- ./Task Summaries --> */}
        
 {/* <!-- students Upload Modal --> */}
       
      {showStudModal ? (
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
                    Register Students
                  </h3>
                  
                </div>
                {/*body*/}
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex justify-end p-2">
                
            </div>
            <form class="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8" action="#">
                <h3 class="text-xl font-medium text-gray-900 dark:text-white">Upload .csv of Students' Addresses</h3>

                {!isFileUpload
              ?  <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">File Upload</label>
              <input type="file" name="StudentUpload" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" onChange={handleChange} required />
          </div>
              : (
                <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={(e)=>handleUpload(e, "student", Addresses)}>Upload Students</button>
              )}
                
                
               
                
            </form>
        </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setshowStudModal(false)}
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

{/* Directors' Modal */}
{showDirModal ? (
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
                    Register Directors
                  </h3>
                  
                </div>
                {/*body*/}
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex justify-end p-2">
                
            </div>
            <form class="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8" action="#">
                <h3 class="text-xl font-medium text-gray-900 dark:text-white">Upload .csv of Directors' Addresses</h3>

                {!isFileUpload
              ?  <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">File Upload</label>
              <input type="file" name="StudentUpload" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" onChange={handleChange} required />
          </div>
              : (
                <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={(e)=>handleUpload(e, "directors", Addresses)}>Upload Directors</button>
              )}
                
                
               
                
            </form>
        </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setshowDirModal(false)}
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


      {/* Teachers' Modal */}
{showTchModal ? (
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
                    Register Teachers
                  </h3>
                  
                </div>
                {/*body*/}
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex justify-end p-2">
                
            </div>
            <form class="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8" action="#">
                <h3 class="text-xl font-medium text-gray-900 dark:text-white">Upload .csv of Teachers' Addresses</h3>

                {!isFileUpload
              ?  <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">File Upload</label>
              <input type="file" name="StudentUpload" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" onChange={handleChange} required />
          </div>
              : (
                <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={(e)=>handleUpload(e, "teacher", Addresses)}>Upload Teachers</button>
              )}
                
                
               
                
            </form>
        </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setshowTchModal(false)}
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


         {/* setup Election's Modal */}
{showSetElectModal ? (
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
                    Setup Elections
                  </h3>
                  
                </div>
                {/*body*/}
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex justify-end p-2">
                
            </div>
            <form class="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8" action="#">
                <h3 class="text-xl font-medium text-gray-900 dark:text-white">Select Category of Election and Type in Candidates ID seperated by comma</h3>

                <div>
                    <label for="candidates" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Candidates IDs:</label>
                    <input type="text" name="candidates" id="candidates" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required value={candidateID} onChange={(e)=>{
                      setcandidateID(e.target.value)
                      
                    }}/>
                </div>

                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
        Category
      </label>
      <div class="col-span-6 sm:col-span-3">
        <select class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"  onChange={(e)=>{
        const result= e.target.value;
        setselectCategory(result)}} value={selectCategory}>
          {CategoryList.map((category)=>{
            return  (<option value={category}>{category}</option>
            )
          })}
         
        </select>
        
      </div>
    </div>
    <button class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={(e)=>setupElect(e)}>Setup Election</button>  
    {/* setupElect    */}
            </form>
        </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setshowSetElectModal(false)}
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

  {/* Add Election Category Modal */}
  {showElectCategoryModal ? (
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
                    Add Category
                  </h3>
                  
                </div>
                {/*body*/}
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex justify-end p-2">
                
            </div>
            <form class="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8" action="#">
                <h3 class="text-xl font-medium text-gray-900 dark:text-white">Type in Category of Election</h3>

                <div>
                    <label for="candidates" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Category:</label>
                    <input type="text" name="candidates" id="candidates" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="President" required value={Category} onChange={(e)=>setCategory(e.target.value)}/>
                </div>
                <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={(e)=>handleCategory(e)}>Add Category</button>
                
            </form>
        </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setshowElectCategoryModal(false)}
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


  {/* Register Candidate Modal */}
  {showRegCandidateModal ? (
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
                    Register Candidate
                  </h3>
                  
                </div>
                {/*body*/}
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex justify-end p-2">
                
            </div>
            <form class="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8" action="#">
                <h3 class="text-xl font-medium text-gray-900 dark:text-white">Enter Candidate and Select Category</h3>

                <div>
                    <label for="candidates" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Candidate Name:</label>
                    <input type="text" name="candidates" id="candidates" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="John" required value={candidateName} onChange={(e)=>{
                      setcandidateName(e.target.value)
                      
                    }}/>
                </div>

                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
        Category
      </label>
      <div class="col-span-6 sm:col-span-3">
        <select class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"  onChange={(e)=>{
        const result= e.target.value;
        setselectCategory(result)
      }} value={selectCategory}>
          {CategoryList.map((position)=>{
            return  <option value={(position.toString())}>{position}</option>
          })}
         
        </select>
        
      </div>
    </div>
    <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={(e)=>RegCandidate(e)}>Register</button>  
    {/* setupElect    */}
            </form>
        </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setRegCandidateModal(false)}
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
            
        {/* <!-- ./Client Table --> */}
              
              </div>

           
        
        </section>

      </main>

    </div> </div>
  );
}

export default TeacherPortal;