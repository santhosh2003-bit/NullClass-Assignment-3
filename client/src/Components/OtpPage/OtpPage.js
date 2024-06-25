import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handle_Submit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetch(
        "https://nullclass-assignment-3.onrender.com/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            otp: otp,
          }),
        }
      );
      const res = await data.json();
      if (res.error) {
        console.log(res.error);
      } else if (res.message) {
        alert(res.message);
        navigate("/login");
      } else {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.useDetails));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-400 w-full h-screen flex justify-center items-center p-4">
      <form
        onSubmit={handle_Submit}
        className="bg-white p-8 flex flex-col w-full max-w-md rounded-xl shadow-2xl"
      >
        <h1 className="text-center text-2xl font-bold mb-5">Enter OTP</h1>
        <div className="border-2 pt-2 pb-2 pl-3 pr-3 rounded-xl mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-none outline-none w-full"
          />
        </div>
        <div className="border-2 pt-2 pb-2 pl-3 pr-3 rounded-xl mb-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border-none outline-none w-full"
          />
        </div>

        <div className="bg-green-500 hover:bg-green-600 pt-2 pb-2 pl-3 pr-3 rounded-lg">
          <input
            type="submit"
            value="Submit"
            className="w-full text-white font-bold text-xl cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default OtpPage;
