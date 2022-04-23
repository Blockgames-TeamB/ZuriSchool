import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { shortenAddress } from "../utils/shortenAddress";

import { ConnectContext } from "../context/ConnectContext";

function Header() {

  const {currentAccount, connectWallet, networkConnected } = useContext(ConnectContext);


  
  const [top, setTop] = useState(true);

  // detect whether user has scrolled the page down by 10px 
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true)
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);  

  return (
   
    
    <header className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${!top && 'bg-white backdrop-blur-sm shadow-lg'}`} id="page-wrap">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Site branding */}
          <div className="flex-shrink-0 mr-4">
            {/* Logo */}
            <Link to="/" className="block" aria-label="Cruip">
              <svg className="w-8 h-8" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient cx="21.152%" cy="86.063%" fx="21.152%" fy="86.063%" r="79.941%" id="header-logo">
                    <stop stopColor="#4FD1C5" offset="0%" />
                    <stop stopColor="#81E6D9" offset="25.871%" />
                    <stop stopColor="#338CF5" offset="100%" />
                  </radialGradient>
                </defs>
                <rect width="32" height="32" rx="16" fill="url(#header-logo)" fillRule="nonzero" />
              </svg>
            </Link>
          </div>

          {/* Site navigation */}
          <nav className="flex flex-grow">
            
          
            {!currentAccount ?
                    <ul className="flex flex-grow justify-end flex-wrap items-center"> <li>
                    <span className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"></span>
                  </li>
                  <li>
                  <a className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0" href="#0" onClick={connectWallet}>Connect Wallet</a>
                  </li>
                  </ul>
                :(
                  <ul className="flex flex-grow justify-evenly flex-wrap items-center">
                  <li>
                <span className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">Welcome: {shortenAddress(currentAccount)} connected to: {networkConnected}</span>
              </li>
              <li>
                <span className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"></span>
              </li>
              </ul>
                )
                }
              
            

          </nav>

        </div>
      </div>
    </header>
  );
}

export default Header;
