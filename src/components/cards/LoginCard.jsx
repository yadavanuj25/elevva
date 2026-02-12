import React from "react";
import loginbg from "../../assets/login/login4.png";
import login3 from "../../assets/login/login3.png";

const LoginCard = () => {
  return (
    <div className="relative order-1 hidden md:flex justify-center items-center w-full backdrop-blur-xl bg-gradient-to-b from-[#0a60ee] to-[#203455] py-10">
      <img src={login3} alt="" className="absolute bottom-6 right-3" />
      <img src={login3} alt="" className="absolute top-[-64px] left-[-64px]" />

      <div className="relative w-[80%] rounded-3xl p-10 border border-white/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1869e7cf] to-[#2c475aa6] backdrop-blur-md"></div>

        <div className="relative z-10">
          <h3 className="text-white font-bold text-4xl leading-snug mb-5 text-center">
            Supercharge Your Customer Relations With Elevva CRM.
          </h3>

          <div className="flex justify-center mb-5">
            <img src={loginbg} alt="" className="object-contain" />
          </div>

          <h2 className="text-white  text-center">
            Everything You Need to Succeed.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
