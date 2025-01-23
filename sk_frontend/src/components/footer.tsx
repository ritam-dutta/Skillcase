import "../App.css";
import { Link } from "react-router-dom";

interface Footer {}

const Footer: React.FC<Footer> = ({}) => {
  return (
    <footer className="footer bg-gray-800 text-white h-[8vh] w-full flex flex-col md:flex-row justify-between items-center px-4">
      {/* Left Section */}
      <div className="foot1 w-full md:w-1/3 flex justify-center md:justify-start items-center mb-2 md:mb-0">
        <p className="font-sans font-semibold text-sm md:text-lg text-gray-300">
          © SkillCase 2024 | Ritam Dutta
        </p>
      </div>

      {/* Right Section */}
      <div className="foot2 w-full md:w-1/3 flex justify-center md:justify-end items-center space-x-6">
        <Link
          to="/contact"
          className="text-gray-300 text-sm md:text-base hover:text-yellow-400 transition duration-300"
        >
          Contact Us
        </Link>
        <Link
          to="/about"
          className="text-gray-300 text-sm md:text-base hover:text-yellow-400 transition duration-300"
        >
          About Us
        </Link>
        <Link
          to="/privacy"
          className="text-gray-300 text-sm md:text-base hover:text-yellow-400 transition duration-300"
        >
          Privacy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
