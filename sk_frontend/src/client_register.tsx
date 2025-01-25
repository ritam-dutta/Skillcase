import "./App.css"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import Footer from "./components/footer"

interface Client_reg {}
const Client_reg : React.FC<Client_reg> = ({})=>{
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [email,setEmail]=useState('')
    const [dob,setDob]=useState('')
    const [company,setCompany]=useState('')
    const [department,setDepartment]=useState('')
    const [industry,setIndustry]=useState('')
    const [phone,setPhone]=useState('')
    const [confirmPassword,setConfirmPassword]=useState('')
    const [fullname,setFullname]=useState('')
    // const [role,setRole]=useState('client')

    const url = window.location.href;
    let role="";
    if(url.includes("freelancer")){
        role="freelancer"
    }
    else{
        role="client"
    } 

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
        if(!email || !username || !fullname || !dob || !phone){
            alert("Please fill all the required fields")
            return;
        }
        try {
            const response = await axios.post("http://localhost:8000/api/v1/client/register", {
                username: username,
                password: password,
                email: email,
                dob: dob,
                company: company || "",
                department: department || "",
                industry: industry || "",
                phone: phone,
                confirm: confirmPassword,
                fullname: fullname,
                role: "client"
            });
            const clientData = response.data;
            console.log("Register Successful:", response.data);
            localStorage.setItem("user", JSON.stringify(clientData));
            localStorage.setItem("role", "client");
            navigate(`/${role}/profile/${username}`)
        } catch (error) {
            console.error("Login Error:", error);
        }
    }

  return(
    <>
        <div className="container h-lvh w-lvw flex flex-col justify-center items-center bg-gradient-to-b from-slate-200 to-slate-400 gap-5 overflow-hidden">
    {/* Navbar */}
    <div className="navbar h-[10vh] w-full px-6 flex justify-between items-center bg-gradient-to-r from-blue-400 to-blue-600 shadow-md">
        <div className="flex items-center">
          <img src="/images/logo.png" alt="Logo" className="h-12 w-auto" />
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to={`/${role}/login`}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-full shadow hover:bg-blue-400 transition duration-300"
          >
            Sign In
          </Link>
          <Link
            to="/connector"
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-full shadow hover:bg-blue-400 transition duration-300"
          >
            Select Role
          </Link>
        </div>
      </div>

    {/* Registration Form */}
    <div className="register-container w-[30vw] h-auto bg-slate-200 rounded-[10px] border-[1px] border-blue-400 shadow-sm shadow-blue-900 hover:shadow-2xl hover:shadow-blue-400 transition duration-300 p-8">
        <h2 className="text-center text-blue-600 text-3xl font-semibold mb-6">
            Create Your Account As a Client
        </h2>
        <p className="text-center text-gray-600 mb-8">Welcome to Skillcase! Fill out the form below to get started.</p>
        <form className="space-y-6 h-[45vh] overflow-y-auto">
            {/* Input Fields */}
            {[
                { placeholder: "Full Name", value: fullname, setValue: setFullname, type: "text",Image : "/images/user.png" },
                { placeholder: "Username", value: username, setValue: setUsername, type: "text", Image : "/images/user.png" },
                { placeholder: "Email Address", value: email, setValue: setEmail, type: "email", Image : "/images/email.png" },
                { placeholder: "Date of Birth", value: dob, setValue: setDob, type: "date", Image : "/images/dob.png" },
                { placeholder: "Company", value: company, setValue: setCompany, type: "text", Image : "/images/company.png" },
                { placeholder: "Department", value: department, setValue: setDepartment, type: "text", Image : "/images/department.png" },
                { placeholder: "Industry", value: industry, setValue: setIndustry, type: "text", Image : "/images/industry.png" },
                { placeholder: "Phone", value: phone, setValue: setPhone, type: "text", Image : "/images/phn.png" },
                { placeholder: "Set Password", value: password, setValue: setPassword, type: "password", Image : "/images/pwd.png" },
                { placeholder: "Confirm Password", value: confirmPassword, setValue: setConfirmPassword, type: "password", Image : "/images/pwd.png" },
            ].map(({ placeholder, value, setValue, type, Image }, index) => (
                <div className="relative flex items-center" key={index}>
                    <div className="absolute left-3">
                        <img src={Image} alt="User Icon" className="h-5 w-5" />
                     </div>
                    <input
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required
                        className="input w-full pl-10 pr-4 py-3 bg-white border-[1px] border-gray-400 rounded-md text-gray-700 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            ))}

            {/* Sign Up Button */}
            <div className="text-center">
                <button
                    type="button"
                    onClick={handleRegister}
                    className="btn w-full py-3 bg-blue-600 text-white font-semibold rounded-[30px] hover:bg-blue-700 transition duration-300"
                >
                    Sign Up
                </button>
            </div>
        </form>

        {/* Already Have Account */}
        <div className="mt-6 text-center">
            <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/client/login" className="text-blue-600 hover:underline">
                    Sign In
                </Link>
            </p>
        </div>
    </div>
    <Footer />
</div>
    </>

  )

}

export default Client_reg