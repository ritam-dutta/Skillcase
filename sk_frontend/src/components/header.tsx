import { Link, useParams } from "react-router-dom";
import "../App.css";

interface Header {}

const Header: React.FC<Header> = ({}) => {

  const {username} = useParams<{ username: string }>();
  const url = window.location.href;
  const role = url.includes("freelancer") ? "freelancer" : "client";
  let activeTab = "";
    if(url.includes("/projects")){
      activeTab="projects"
    }
    else if(url.includes("/profile")){
      activeTab="profile"
    }
    else if(url.includes("/upload")){
      activeTab="upload"
    }
    else if(url.includes("/contact")){
      activeTab="contact"
    }
    else{
      activeTab="home"
    }
    


  return (
    <header className="h-[8vh] w-full bg-gradient-to-r from-gray-50 to-gray-200 text-white shadow-md">
      <div className="container mx-auto h-full px-6 flex justify-between items-center">
        <div className="flex items-center">

          <Link to="/" className="text-2xl font-bold text-gray-600">
            SkillCase
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-lg font-medium hover:text-gray-400 transition text-gray-600"
          >
            Home
          </Link>
          <Link 
            to={`/${role}/projects/${username}`}
            className={`text-lg font-medium hover:text-gray-400 transition  ${activeTab==="projects" ? "text-gray-400" : "text-gray-600"}`}
          >
            Projects
          </Link>
          {role==="freelancer" ? null :(
          <Link 
            to={`/client/upload_project/${username}`}
            className={`text-lg font-medium hover:text-gray-400 transition  ${activeTab==="upload" ? "text-gray-400" : "text-gray-600"}`}
          >
            Upload Project
          </Link>
          )}
          <Link
            to={`/${role}/profile/${username}`}
            className={`text-lg font-medium hover:text-gray-400 transition  ${activeTab==="profile" ? "text-gray-400" : "text-gray-600"}`}
          >
            Profile
          </Link>
          <Link
            to="/contact"
            className="text-lg font-medium hover:text-gray-400 transition text-gray-600"
          >
            Contact
          </Link>
        </nav>

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
