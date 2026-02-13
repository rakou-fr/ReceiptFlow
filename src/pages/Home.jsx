import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Stats from "../components/landing/Stats";
import CTA from "../components/landing/CTA";
import SupportButton from "../components/common/SupportButton";


const Home = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-silver-200">
      <Navbar />
      <div className="pt-28">
        <Hero />
        <Features />
        <Stats />
        <CTA />
      </div>
      <SupportButton />
    </div>
  );
};

export default Home;
