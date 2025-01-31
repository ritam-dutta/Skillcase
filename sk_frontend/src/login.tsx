import "./App.css"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import Footer from "./components/footer"

interface Login {}
const Login : React.FC<Login> = ({})=>{
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [errorMessage, setErrorMessage] = useState("")
    const [type, setType] = useState("password");
    const [showImage, setShowImage] = useState("show");
    const url = window.location.href;
    let role="";
    if(url.includes("freelancer")){
        role="freelancer"
    }
    else{
        role="client"
    } 
    const navigate = useNavigate()

    const handleLogin = async () => {
        setErrorMessage("")
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/${role}/login`, {
                username: username,
                password: password,
            });
            const accessToken = response.data.data.accessToken;
            console.log("accessToken",accessToken)
            console.log("Login Successful:", response.data);
            localStorage.setItem("accessToken", JSON.stringify(accessToken));
            localStorage.setItem("role", role);
            // console.log(username)

            navigate(`/${role}/profile/${username}`);

        } catch (error) {
            console.error("Login Error:", error);
            setErrorMessage("Login failed. Please check your credentials.");
        }
    };

    const showHide = () => {
      if (type === "password") {
        setType("text");
        setShowImage("dontshow");
      } else {
        setType("password");
        setShowImage("show");
      }
    };
  return(
    <>
      <div className="h-screen w-screen flex flex-col justify-between items-center bg-[url('/images/background.jpg')] bg-cover bg-center">
      {/* Navbar */}
      <div className="navbar h-[8vh] w-full px-6 flex justify-between items-center bg-gradient-to-r from-blue-400 to-blue-600 shadow-md">
        <div className="flex items-center">
          {/* <img src="/images/logo.png" alt="Logo" className="h-12 w-auto" /> */}
          <p className="text-white font-bold text-2xl">Skillcase</p>

        </div>
        <div className="flex items-center space-x-4">
          <Link
            to={`/${role}/register`}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-full shadow hover:bg-blue-400 transition duration-300"
          >
            Sign Up
          </Link>
          <Link
            to="/login/connector"
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-full shadow hover:bg-blue-400 transition duration-300"
          >
            Select Role
          </Link>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-slate-200 shadow-sm shadow-blue-700 rounded-lg p-8 w-[90%] max-w-lg border border-blue-300 hover:shadow-2xl hover:shadow-blue-400 transition duration-300">
        <h2 className="text-center text-3xl font-bold text-blue-600 mb-4">
          Hey {role[0].toUpperCase()+role.slice(1,)}!<br /> Welcome to SkillCase
        </h2>
        <p className="text-center text-gray-600 mb-6">Please sign in to continue</p>

        {errorMessage && (
          <div className="text-center text-red-600 font-medium mb-4">
            {errorMessage}
          </div>
        )}

        <form className="space-y-6">
          {/* Username Input */}
          <div className="relative flex items-center">
            <div className="absolute left-3">
              <img src="/images/user.png" alt="User Icon" className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="relative flex items-center">
            <div className="absolute left-3">
              <img src="/images/pwd.png" alt="Password Icon" className="h-5 w-5" />
            </div>
            <input
              type={type}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              required
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
            <div className="absolute right-3 cursor-pointer">
              <img src={`/images/${showImage}.png`} alt="Show Password Icon" className="h-5 w-5" onClick={showHide} />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600">Remember Me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-400 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to={`/${role}/register`}
            className="text-blue-500 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
    </>
  )
}

export default Login