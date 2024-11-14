import React from "react";
import "./LandingPage.css";

export const LandingPage = () => {
  return (
    <div className='flex h-screen flex-col items-center bg-neutral-900 text-white pt-16'>
        <h1 className="text-4xl font-bold text-white pb-4">Imagine a place...</h1>
        {/* <h1 className='mt-16 mb-4 font-bold text-4xl'>Welcome to Neocord!</h1> */}
        <p className="mb-4 text-lg text-center w-1/2 ">...where you can belong to a school club, a gaming group, or a worldwide art community. Where just you and a handful of friends can spend time together. A place that makes it easy to talk every day and hang out more often.</p>
        <button type="button" className='transition ease-in-out delay-100 bg-blue-500 hover:scale-110 hover:bg-indigo-500 duration-300 cursor-pointer rounded-lg bg-white px-4 py-2 font-semibold text-black'>Get Started</button>
    </div>
  );
};


