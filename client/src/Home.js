import React, { useEffect } from "react";
import Navbar from "./Components/Navbar/Navbar";

import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  return (
    <div className="w-full h-screen relative bg-black">
      <Navbar />
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold font-sans text-center p-4">
        Welcome To Login Tracking App
      </h1>
    </div>
  );
};

export default Home;
