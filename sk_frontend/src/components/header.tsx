import { Link } from "react-router-dom";
import "../App.css";

interface Header {}

const Header: React.FC<Header> = ({}) => {
  return (
    <header className="h-[8vh] w-full bg-gradient-to-r from-gray-50 to-gray-200 text-white shadow-md">
      <div className="container mx-auto h-full px-6 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-gray-600">
            SkillCase
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-lg font-medium hover:text-gray-400 transition text-gray-600"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-lg font-medium hover:text-gray-400 transition text-gray-600"
          >
            About
          </Link>
          <Link
            to="/services"
            className="text-lg font-medium hover:text-gray-400 transition text-gray-600"
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="text-lg font-medium hover:text-gray-400 transition text-gray-600"
          >
            Contact
          </Link>
        </nav>

        {/* Action Buttons */}
        {/* <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm bg-transparent border border-white rounded-md hover:bg-white hover:text-blue-600 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm bg-white text-blue-600 rounded-md hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>
        </div> */}

        {/* Mobile Menu Icon */}
        <div className=" flex items-center">
          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
