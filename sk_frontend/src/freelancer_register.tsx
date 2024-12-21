import "./App.css"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Footer from "./components/footer"
import axios from "axios"

interface Freelancer_reg {}
const Freelancer_reg : React.FC<Freelancer_reg> = ({})=>{
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [email,setEmail]=useState('')
    const [dob,setDob]=useState('')
    const [education,setEducation]=useState('')
    const [industry,setIndustry]=useState('')
    const [phone,setPhone]=useState('')
    const [confirmPassword,setConfirmPassword]=useState('')
    const [fullname,setFullname]=useState('')

    // const url = window.location.href;
    // let role="";
    // if(url.includes("freelancer")){
    //     role="freelancer"
    // }
    // else{
    //     role="client"
    // } 

    const navigate = useNavigate()

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if(phone.length>0 && phone.length !== 10){
            alert("Phone number should be of 10 digits")
            return;
        }
        if(!username || !password || !email || !dob || !education || !industry || !fullname){
            alert("Please fill all the fields")
            return;
        }
        try {
            const response = await axios.post("http://localhost:8000/api/v1/freelancer/register", {
                username: username,
                password: password,
                email: email,
                dob: dob,
                education: education,
                industry: industry,
                phone: phone,
                fullname: fullname,
                role: "freelancer"
            });
            const {accessToken} = response.data;
            console.log("Regsiter Successful:", response.data);

            localStorage.setItem("accessToken", JSON.stringify(accessToken));
            localStorage.setItem("role", "freelancer");
            navigate("/profile")
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

  return(
    <>
        <div className="container h-lvh w-lvw flex flex-col justify-between items-center bg-[url(../images/background.jpg)] bg-cover bg-center gap-0 overflow-hidden">
        <div className="navbar h-[9vh] w-[100vw] relative flex flex-row justify-between items-center">
            <div id="logo" className="h-[60px] w-[200px] ml-[30px]"><img src="/images/logo.png" alt="" id="logo_img" className="h-[60px] w-[200px]"/></div>
            <div className="sign h-[100%] w-[20%] flex flex-row justify-evenly items-center">
                <button className="btn_sign hover:bg-[rgb(241,186,6,0.7)] h-[80%] w-[40%] rounded-[30px] bg-transparent border-[3px] border-[rgb(241,186,6)] transition duration-500 ease-in-out"><Link to="/freelancer/login" className="head_text text-lg font-sans text-[rgb(241,186,6)] text-[17px] relative">Sign In</Link></button>
                {/* <button className="btn_sign hover:bg-[rgb(241,186,6,0.7)] h-[80%] w-[40%] rounded-[30px] bg-transparent border-[3px] border-[rgb(241,186,6)] transition duration-500 ease-in-out"><a href="connector.html" className="head_text text-lg font-sans text-[rgb(241,186,6)] text-[17px] relative" >Sign Up</a></button> */}
            </div>
        </div>
        <div className="boxes w-[26vw] h-[7vh] inline-flex justify-end gap-[2px] mr-[20px] relative z-0">
            <div className="box h-[100%] w-[13%] inline-block rounded-[5px] transition duration-300 ease-in-out translate-y-[95%] hover:translate-y-[60%]"><Link to="https://www.facebookcom"><img src="/images/fb.png" alt="" className="img h-[55px] w-[55px]"/></Link></div>
            <div className="box h-[100%] w-[13%] inline-block rounded-[5px] transition duration-300 ease-in-out translate-y-[95%] hover:translate-y-[60%]"><Link to="https://www.twitter.com"><img src="/images/twitter.png" alt="" className="img h-[55px] w-[55px]" id="twitter"/></Link></div>
            <div className="box h-[100%] w-[13%] inline-block rounded-[5px] transition duration-300 ease-in-out translate-y-[95%] hover:translate-y-[60%]"><Link to="https://www.google.com"><img src="/images/google.png" alt="" className="img h-[55px] w-[55px]"/></Link></div>
        </div>
        <div className="login w-[27vw] h-[65vh] border-[1px] border-black rounded-[5px] backdrop-blur-[25px]">
            <div className="login1 w-[100%] h-[10%] flex flex-row justify-between">
                <div className="sign_in h-[100%] w-[80%] ml-[5%] flex items-center"><p className="font-medium text-xl font-sans text-[rgb(241,186,6)]">Freelancer</p></div>
            </div>
            <div className="welcome h-[12%] w-[100%] flex justify-center items-center font-sans font-bold text-lg"><p className="text-[rgb(241,186,6)] text-[22px]">Welcome to Skillcase!</p></div>
            <div className="info h-[40%] w-[100%] flex flex-col justify-start items-center gap-[25px] overflow-y-scroll overflow-x-hidden">
                <div className="about h-[30%] w-[90%] border-[1px] border-black flex flex-row rounded-[5px] hover:border-[2px] hover:bg-[rgb(241,186,6,0.5)]">
                    <div className="icon h-[100%] w-[16%] rounded-bl-[5px] rounded-tl-[5px] bg-[rgb(241,186,6)] flex justify-center items-center"><img src="/images/user.png" alt="" className="info_img h-[25px] w-[25px]"/></div>
                    <div className="input h-[100%] w-[85%] flex items-end"><input type="text" className="take_info h-[100%] w-[100%] pl-[10px] border-none rounded-tl-[5px] rounded-br-[5px] bg-transparent backdrop-blur-[100%] focus:outline-none focus:border-none" placeholder="*Full name" name="full name"
                     value={fullname} onChange={(e) => setFullname(e.target.value) } 
                     required/></div>
                </div>
                <div className="about h-[30%] w-[90%] border-[1px] border-black flex flex-row rounded-[5px] hover:border-[2px] hover:bg-[rgb(241,186,6,0.5)]">
                    <div className="icon h-[100%] w-[16%] rounded-bl-[5px] rounded-tl-[5px] bg-[rgb(241,186,6)] flex justify-center items-center"><img src="/images/user.png" alt="" className="info_img h-[25px] w-[25px]"/></div>
                    <div className="input h-[100%] w-[85%] flex items-end"><input type="text" className="take_info h-[100%] w-[100%] pl-[10px] border-none rounded-tl-[5px] rounded-br-[5px] bg-transparent backdrop-blur-[100%] focus:outline-none focus:border-none" placeholder="*Username" name="username"
                    value={username} onChange={(e) => setUsername(e.target.value) } 
                    required/></div>
                </div>
                <div className="about h-[30%] w-[90%] border-[1px] border-black flex flex-row rounded-[5px] hover:border-[2px] hover:bg-[rgb(241,186,6,0.5)]">
                    <div className="icon h-[100%] w-[16%] rounded-bl-[5px] rounded-tl-[5px] bg-[rgb(241,186,6)] flex justify-center items-center"><img src="/images/email.png" alt="" className="info_img h-[25px] w-[25px]"/></div>
                    <div className="input h-[100%] w-[85%] flex items-end"><input type="email" className="take_info h-[100%] w-[100%] pl-[10px] border-none rounded-tl-[5px] rounded-br-[5px] bg-transparent backdrop-blur-[100%] focus:outline-none focus:border-none" placeholder="*Email Address" name="email" 
                    value={email} onChange={(e) => setEmail(e.target.value) }
                    required/></div>
                </div>
                <div className="about h-[30%] w-[90%] border-[1px] border-black flex flex-row rounded-[5px] hover:border-[2px] hover:bg-[rgb(241,186,6,0.5)]">
                    <div className="icon h-[100%] w-[16%] rounded-bl-[5px] rounded-tl-[5px] bg-[rgb(241,186,6)] flex justify-center items-center"><img src="/images/dob.png" alt="" className="info_img h-[25px] w-[25px]"/></div>
                    <div className="input h-[100%] w-[85%] flex items-end"><input type="date" className="take_info h-[100%] w-[100%] pl-[10px] border-none rounded-tl-[5px] rounded-br-[5px] bg-transparent backdrop-blur-[100%] focus:outline-none focus:border-none" placeholder="*Date of birth" name="dob" 
                    value={dob} onChange={(e) => setDob(e.target.value) }
                    required/></div>
                </div>
                <div className="about h-[30%] w-[90%] border-[1px] border-black flex flex-row rounded-[5px] hover:border-[2px] hover:bg-[rgb(241,186,6,0.5)]">
                    <div className="icon h-[100%] w-[16%] rounded-bl-[5px] rounded-tl-[5px] bg-[rgb(241,186,6)] flex justify-center items-center"><img src="/images/company.png" alt="" className="info_img h-[25px] w-[25px]"/></div>
                    <div className="input h-[100%] w-[85%] flex items-end"><input type="text" className="take_info h-[100%] w-[100%] pl-[10px] border-none rounded-tl-[5px] rounded-br-[5px] bg-transparent backdrop-blur-[100%] focus:outline-none focus:border-none" placeholder="*Education" name="education" 
                    value={education} onChange={(e) => setEducation(e.target.value) }
                    required/></div>
                </div>
                <div className="about h-[30%] w-[90%] border-[1px] border-black flex flex-row rounded-[5px] hover:border-[2px] hover:bg-[rgb(241,186,6,0.5)]">
                    <div className="icon h-[100%] w-[16%] rounded-bl-[5px] rounded-tl-[5px] bg-[rgb(241,186,6)] flex justify-center items-center"><img src="/images/department.png" alt="" className="info_img h-[25px] w-[25px]"/></div>
                    <div className="input h-[100%] w-[85%] flex items-end"><input type="text" className="take_info h-[100%] w-[100%] pl-[10px] border-none rounded-tl-[5px] rounded-br-[5px] bg-transparent backdrop-blur-[100%] focus:outline-none focus:border-none" placeholder="*Industry" name="industry" 
                    value={industry} onChange={(e) => setIndustry(e.target.value) }
                    required/></div>
                </div>
               
                <div className="about h-[30%] w-[90%] border-[1px] border-black flex flex-row rounded-[5px] hover:border-[2px] hover:bg-[rgb(241,186,6,0.5)]">
                    <div className="icon h-[100%] w-[16%] rounded-bl-[5px] rounded-tl-[5px] bg-[rgb(241,186,6)] flex justify-center items-center"><img src="/images/phn.png" alt="" className="info_img h-[25px] w-[25px]"/></div>
                    <div className="input h-[100%] w-[85%] flex items-end"><input type="text" className="take_info h-[100%] w-[100%] pl-[10px] border-none rounded-tl-[5px] rounded-br-[5px] bg-transparent backdrop-blur-[100%] focus:outline-none focus:border-none" placeholder="*Phone number" name="Phone number"
                    value={phone} onChange={(e) => setPhone(e.target.value) }
                    /></div>
                </div>
                <div className="about h-[30%] w-[90%] border-[1px] border-black flex flex-row rounded-[5px] hover:border-[2px] hover:bg-[rgb(241,186,6,0.5)]">
                    <div className="icon h-[100%] w-[16%] rounded-bl-[5px] rounded-tl-[5px] bg-[rgb(241,186,6)] flex justify-center items-center"><img src="/images/pwd.png" alt="" className="info_img h-[25px] w-[25px]"/></div>
                    <div className="input h-[100%] w-[85%] flex items-end"><input type="password" className="take_info h-[100%] w-[100%] pl-[10px] border-none rounded-tl-[5px] rounded-br-[5px] bg-transparent backdrop-blur-[100%] focus:outline-none focus:border-none" placeholder="*Set password" name="set passowrd" 
                    value={password} onChange={(e) => setPassword(e.target.value) }
                    required/></div>
                </div>
                <div className="about h-[30%] w-[90%] border-[1px] border-black flex flex-row rounded-[5px] hover:border-[2px] hover:bg-[rgb(241,186,6,0.5)]">
                    <div className="icon h-[100%] w-[16%] rounded-bl-[5px] rounded-tl-[5px] bg-[rgb(241,186,6)] flex justify-center items-center"><img src="/images/tick.png" alt="" className="info_img h-[25px] w-[25px]"/></div>
                    <div className="input h-[100%] w-[85%] flex items-end"><input type="password" className="take_info h-[100%] w-[100%] pl-[10px] border-none rounded-tl-[5px] rounded-br-[5px] bg-transparent backdrop-blur-[100%] focus:outline-none focus:border-none" placeholder="*Confirm passowrd" name="confirm passowrd" 
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value) }
                    required/></div>
                </div>
            </div>
            <div className="login_submit h-[20%] w-[100%] mt-[10px] flex justify-center items-center">
                <button className="submit w-[25%] h-[40%] bg-[rgb(241,186,6)] border-none rounded-[20px] text-[17px] font-sans"
                onClick={handleRegister}
                >Sign Up</button>
            </div>
            <div className="last w-[100%] h-[10%] flex flex-col items-center justify-start">
                <p className="font-sans text-[rgb(255,225,2)]">Already have an account? <Link to="/freelancer/login" className="text font-sans text-[#a1f6fc] text-lg" >Sign In</Link></p>
            </div>
        </div>
        <Footer></Footer>
    </div>
    </>

  )

}

export default Freelancer_reg