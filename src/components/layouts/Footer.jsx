import React from "react";

const Footer = () => {
  return (
    <>
      <footer className=" w-full flex justify-end items-center bg-white dark:bg-darkBg text-center text-sm px-4 sm:px-6 py-4 mt-auto border-t border-[#E8E8E9] dark:border-gray-700 shadow">
        <div>
          &copy; {new Date().getFullYear()} Elevva CRM . All rights reserved
        </div>
      </footer>
    </>
  );
};

export default Footer;
