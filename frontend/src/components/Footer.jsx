import React from "react";
import { FaGithub } from "react-icons/fa";
import { BsYoutube } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="border py-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className=" text-center md:text-start">
            <h2 className="text-lg font-semibold mb-4">COMPLAINT REGISTRATION</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  File Type
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Text Description
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Audio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Video
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Image
                </a>
              </li>
            </ul>
          </div>
          <div className=" text-center md:text-start">
            <h2 className="text-lg font-semibold mb-4">COMPLAINT STATUS</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Complaint Statement
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Assigned Officer
                </a>
              </li>
            </ul>
          </div>

          <div className=" text-center md:text-start">
            <h2 className="text-lg font-semibold mb-4">COMPLAINT FEED</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Complainant Name
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Complaint Statement
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  AI Model Assignment Time
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Complaint Addressed By The Officer (With Time)
                </a>
              </li>
            </ul>
          </div>
          <div className=" text-center md:text-start">
            <h2 className="text-lg font-semibold mb-4">AI CHATBOT</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  The entire chatbot will be implemented here
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className=" container mx-auto  flex flex-col md:flex-row justify-between items-center">
        <div className="text-xl font-semibold hidden md:flex">
          Rail<span className="text-blue-500 font-bold">Mate</span>
        </div>
        <div className="text-gray-400 text-sm hidden md:flex">
          <p>&copy; 2024 Syntax Sorcerers PVT. LTD. All rights reserved</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <a href="#">
            <FaGithub className="h-6" />
          </a>
          <a href="#">
            <BsYoutube className="h-6" />
          </a>

          <a href="#">
            <FaLinkedin className="h-6" />
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
