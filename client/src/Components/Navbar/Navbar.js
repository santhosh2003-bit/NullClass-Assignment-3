import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");

  const handle_Navigates = () => {
    if (token) {
      return (
        <li>
          <Link
            to="/details"
            className="text-xl hover:border-b-2 font-bold hover:cursor-pointer"
          >
            Details
          </Link>
        </li>
      );
    } else {
      return (
        <>
          <li>
            <Link to="/login" className="text-xl hover:cursor-pointer">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="text-xl hover:cursor-pointer">
              Register
            </Link>
          </li>
        </>
      );
    }
  };

  return (
    <div className="flex justify-around items-center text-white p-4">
      <div>
        <Link
          to="/"
          className="text-2xl font-serif font-bold hover:cursor-pointer"
        >
          Tracker
        </Link>
      </div>
      <div className="w-full max-w-md">
        <ul className="flex justify-around items-center">
          {handle_Navigates()}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
