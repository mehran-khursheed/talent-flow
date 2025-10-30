import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal.jsx";


const PublicNavbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("login"); 

  const openModal = (mode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <nav className="w-full bg-black/80 backdrop-blur-md h-20 flex items-center justify-between px-8 text-white sticky top-0 z-50">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">TalentFlow</span>
        </Link>

        {/* Public Links */}
        <div className="hidden md:flex items-center space-x-6 font-semibold text-spotify-light-gray">
          <Link to="/resources" className="hover:text-white transition-colors">
            Resources
          </Link>
          <Link to="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
          <Link to="/support" className="hover:text-white transition-colors">
            Support
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => openModal("signup")}
            className="text-spotify-light-gray font-bold hover:text-white transition-colors"
          >
            Sign Up
          </button>
          <button
            onClick={() => openModal("login")}
            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
          >
            Log In
          </button>
        </div>
      </nav>

      <AuthModal isOpen={isModalOpen} onClose={closeModal} mode={modalMode} />
    </>
  );
};

export default PublicNavbar;
