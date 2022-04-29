import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.scss';


import AOS from 'aos';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import VotingBooth from './pages/VotingBooth';
import AdminPortal from './pages/AdminPortal';
import TeacherPortal from './pages/TeacherPortal';
import DirectorPortal from './pages/DirectorPortal';
import ElectionResult from './pages/ElectionResult';
import { ConnectProvider } from "./context/ConnectContext";
function App() {

  const location = useLocation();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic',
    });
  });

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <ConnectProvider>
     
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/VotingBooth" element={<VotingBooth />} />
        <Route path="/AdminPortal" element={<AdminPortal />} />
        <Route path="/TeacherPortal" element={<TeacherPortal />} />
        <Route path="/DirectorPortal" element={<DirectorPortal />} />
        <Route path="/ElectionResult" element={<ElectionResult />} />
      </Routes>
      <ToastContainer />
      </ConnectProvider>
  );
}

export default App;
