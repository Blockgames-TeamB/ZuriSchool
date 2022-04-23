import React, { useRef } from 'react';

import Header from '../partials/Header';
import HeroHome from '../partials/HeroHome';
import FeaturesHome from '../partials/Features';
import FeaturesBlocks from '../partials/FeaturesBlocks';
import Testimonials from '../partials/Testimonials';
import Newsletter from '../partials/Newsletter';
import Footer from '../partials/Footer';
import Sidebar from "../components/Sidebar"
function Home() {
  

  const scrollToDiv = (ref) => window.scrollTo({ top:ref.current.offsetTop, left:0, behavior: "smooth"});
  const el1 = useRef();
  const el2 = useRef();
  //
  //window.scrollTo(0, ref.current.offsetTop);

  return (
    <div id="outer-container">
    <Sidebar pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } />
    <div className="flex flex-col min-h-screen overflow-hidden" id="page-wrap">

      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">

        {/*  Page sections */}
        <HeroHome reference={el1} click={()=> scrollToDiv(el2)} />
        <FeaturesHome reference={el2}  />
        <FeaturesBlocks />
        <Testimonials />
        <Newsletter />

      </main>

      {/*  Site footer */}
      <Footer />

    </div></div>
  );
}

export default Home;