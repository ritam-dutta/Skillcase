import "./App.css"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

interface Login {}
const Login : React.FC<Login> = ({})=>{
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [errorMessage, setErrorMessage] = useState("")
    const url = window.location.href;
    let role="";
    if(url.includes("freelancer")){
        role="freelancer"
    }
    else{
        role="client"
    } 
    console.log(url)
    const navigate = useNavigate()

    const handleLogin = async () => {
        setErrorMessage("")
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/${role}/login`, {
                username: username,
                password: password,
            });
            const accessToken = response.data.data.accessToken;
            console.log("hi")
            console.log(accessToken)
            console.log("Login Successful:", response.data);
            localStorage.setItem("accessToken", JSON.stringify(accessToken));
            console.log(username)

            navigate(`/${role}/${username}`);

        } catch (error) {
            console.error("Login Error:", error);
            setErrorMessage("Login failed. Please check your credentials.");
        }
    };
  return(
    <>
      <div className="container h-lvh w-lvw flex flex-col justify-between items-center bg-cover bg-center gap-0 overflow-hidden bg-[url(../images/background.jpg)] ">
        <div className="navbar h-[9-vw] w-lvw relative flex flex-row justify-between items-center">
            <div id="logo" className="h-[60px] w-[200px] ml-[30px]"><img src="/images/logo.png" alt="" id="logo_img" className="h-[60px] w-[200px]"/></div>
            <div className="sign h-[100%] w-[20%] flex flex-row justify-end items-center mr-10">
                <button className="btn_sign hover:bg-[rgb(241,186,6,0.7)] h-[80%] w-[40%] bg-transparent rounded-[30px] border-[3px] border-[rgb(241,186,6)] transition-colors duration-500 ease-in-out "><Link to = {`/${role}/register`}className="head_text text-lg font-sans text-[rgb(241,186,6)] text-[17px] relative btn_sign-hover:text-black">Sign Up</Link></button>
                <button className="btn_sign hover:bg-[rgb(241,186,6,0.7)] h-[80%] w-[40%] bg-transparent rounded-[30px] border-[3px] border-[rgb(241,186,6)] transition-colors duration-500 ease-in-out "><Link to ={`/`} className="head_text text-lg font-sans text-[rgb(241,186,6)] text-[17px] relative">Select role</Link></button>
            </div>
            
        </div>
        <div className="boxes w-[26vw] h-[7vh] inline-flex justify-end gap-[2px] mr-[20px] relative z-0">
            <div className="box h-[100%] w-[13%] rounded-[15px] inline-block translate-y-[120%] duration-500 ease-in-out hover:translate-y-[80%]"><Link to="https://www.facebook.com"><img src="/images/fb.png" alt="" className="img h-[55px] w-[55px]"/></Link></div>
            <div className="box h-[100%] w-[13%] rounded-[15px] inline-block translate-y-[120%] duration-500 ease-in-out hover:translate-y-[80%]"><Link to="https://www.twitter.com"><img src="/images/twitter.png" alt="" className="img h-[55px] w-[55px]" id="twitter"/></Link></div>
            <div className="box h-[100%] w-[13%] rounded-[15px] inline-block translate-y-[120%] duration-500 ease-in-out hover:translate-y-[80%]"><Link to="https://www.google.com"><img src="/images/google.png" alt="" className="img h-[55px] w-[55px]"/></Link></div>
        </div>
        <div className="login w-[27vw] h-[60vh] rounded-[5px] border-[1px] border-black back backdrop-blur-xl">
            <div className="login1 w-[100%] h-[10%] flex flex-row justify-between">
                <div className="sign_in h-[100%] w-[20%] ml-[5%] flex items-center"><p className="text-[rgb(241,186,6)] font-bold text-xl font-serif" >Sign In</p></div>
            </div>
            <div className="welcome h-[12%] w-[100%] flex justify-center font-sans font-bold text-lg"><p className="text-[rgb(241,186,6)] text-[22px] " >Welcome to Skillcase!</p></div>

            {errorMessage && (
            <div className="error-message text-red-600 font-bold text-center mb-2">{errorMessage}</div>
            )}

            <div className="info h-[25%] w-[100%] mt-[20px] flex flex-col justify-center items-center gap-[20px]">
                <div className="about hover:bg-[rgba(241,186,6,0.5)] hover:border-[2px] hover:border-[rgb(241,186,6)] h-[35%] w-[90%] border-[1px] border-black flex flex-row rounded-[5px] ">
                    <div className="icon h-[100] w-[15%] rounded-bl-[5px] rounded-tl-[5px] bg-[rgb(241,186,6)] flex justify-center items-center"><img src="/images/user.png" alt="" className="info_img h-[30px] w-[30px]"/></div>
                    <div className="input h-[100%] w-[85%] flex items-end">
                        <input
                            type="text" 
                            className="take_info focus:outline-none focus:border-none h-[100%] w-[100%] pl-[10px] border-none rounded-tl-[5px] rounded-br-[5px] bg-transparent backdrop-blur-[100%]" 
                            placeholder="Username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            name="username" required/>
                    </div>
                </div>
                <div className="about hover:bg-[rgba(241,186,6,0.5)] hover:border-[2px] hover:border-[rgb(241,186,6)] h-[35%] w-[90%] border-[1px] border-black flex flex-row rounded-[5px]">
                    <div className="icon h-[100] w-[15%] rounded-bl-[5px] rounded-tl-[5px] bg-[rgb(241,186,6)] flex justify-center items-center"><img src="/images/pwd.png" alt="" className="info_img h-[30px] w-[30px]"/></div>
                    <div className="input h-[100%] w-[85%] flex items-end">
                        <input 
                            type="password" 
                            className="take_info focus:outline-none focus:border-none h-[100%] w-[100%] pl-[10px] border-none rounded-tl-[5px] rounded-br-[5px] bg-transparent backdrop-blur-[100%]" 
                            placeholder="Password" 
                            value= {password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            name="password" required/></div>
                </div>
            </div>

            <div className="flex ">
                <div className="remember h-[8%] w-[100%] flex justify-start items-center"><input type="checkbox" className="ml-[5%]"/><p className="pl-[5px] text-sm text-[rgb(241,186,6)] font-sans inline-block " >Remember Me</p></div>
                <div className="w-[70%]"><a href="" className="text font-sans text-[#a1f6fc] text-base">forgot your password?</a></div>
            </div>

            <div className="login_submit h-[20%] w-[100%] flex justify-center items-end">
                <button 
                    className="submit w-[25%] h-[45%] bg-[rgb(241,186,6)] border-none rounded-[20px] text-[17px] font-sans"
                    onClick={handleLogin}
                >Login
                </button>
            </div>
            <div className="last mt-[3%] w-[100%] h-[10%] flex flex-col items-center justify-end">
                <p className="font-serif text-[rgb(255,225,2)]" >Don't have an account? <Link to={`/${role}/register`} className="text font-sans text-[#a1f6fc] text-base" >Sign Up</Link></p>
            </div>
        </div>
        <div className="footer h-[8vh] w-[100vw] flex flex-row justify-between">
            <div className="foot1 h-[100%] w-[30%] flex flex-row justify-center items-center"><p id="foot_text" className="font-sans font-bold text-xl text-[rgb(241,186,6)]">©SkillCase 2024 | Ritam Dutta</p></div>
            <div className="foot2 h-[100%] w-[30%] flex flex-row justify-evenly items-center">
                <div className=" group relative font-segoe-ui text-lg text-yellow-400">
                    <Link to="" className="foot_text2 font-sans text-[rgb(241,186,6)] text-[17px] relative hover:after:scale-x-[1] hover:after:scale-y-[1] ">Contact us</Link>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-400 cursor-pointer transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                </div>
                <div className=" group relative font-segoe-ui text-lg text-yellow-400">
                    <Link to="" className="foot_text2 font-sans text-[rgb(241,186,6)] text-[17px] relative hover:after:scale-x-[1] hover:after:scale-y-[1] ">About us</Link>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-400 cursor-pointer transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                </div>
                <div className=" group relative font-segoe-ui text-lg text-yellow-400">
                    <Link to="" className="foot_text2 font-sans text-[rgb(241,186,6)] text-[17px] relative hover:after:scale-x-[1] hover:after:scale-y-[1] ">Privacy</Link>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-400 cursor-pointer transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Login