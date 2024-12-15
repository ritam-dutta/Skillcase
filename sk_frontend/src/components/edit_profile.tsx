import { Link, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css"
interface Edit {}

const Edit : React.FC<Edit> = ({})=>{
    const navigate = useNavigate();
    const[user,setUser]=useState<any>();
    const [fullname, setFullname] = useState("");	
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [dob, setDob] = useState("");
    const [education, setEducation] = useState("");
    const [industry, setIndustry] = useState("");
    const [about, setAbout] = useState(""); 
    const [skills, setSkills] = useState("");
    const [token, setToken] = useState("");
  
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if(!accessToken){
            console.log("Access token not found")	
            navigate("/profile")
        }
        // console.log(accessToken)
        if (accessToken) {
            setToken(accessToken);
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/freelancer/current_freelancer", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const fetchedUser = response.data?.data?.freelancer;
                console.log(fetchedUser)
                console.log(response.data)
                if(!fetchedUser){
                    navigate("/profile");
                }
                setUser(fetchedUser);
                setFullname(fetchedUser?.fullname || "");
                setPhone(fetchedUser?.phone || "");
                setUsername(fetchedUser?.username || "");
                setDob(fetchedUser?.dob || "");
                setEducation(fetchedUser?.education || "");
                setIndustry(fetchedUser?.industry || "");
                setAbout(fetchedUser?.about || "");
                setSkills(fetchedUser?.skills || "");
                console.log("done axios")
                // console.log(freelancer)
                // setUser(freelancer);
                // setFollowing(freelancer?.following || 0);
                // setFollowers(freelancer?.followers || 0);
                // setAbout(freelancer?.about || "")    
            } catch (error) {
                console.error("error fetching user data",error);
                navigate("/profile");
            }
        };
        fetchUserData();
    }, [navigate]); 

    const handleEdit = async () => {
    
        // console.log(user.data.accessToken)
        // console.log("handleedit")
        if (!user) {
            console.error("User token is missing or invalid.");
            return;
        }
        // const token = user.data.accessToken;
        console.log(token)
        const id = user._id;
        // const data = {
        //     fullname,
        //     phone,
        //     username,
        //     dob,
        //     education,
        //     industry,
        //     about,
        //     skills
        // };
        try {
            console.log("update enter")
            const response = await axios.post("http://localhost:8000/api/v1/freelancer/update_account", {
                username: username || user.username,
                dob: dob || user.dob,
                education: education || user.education,
                industry: industry || user.industry,
                phone: phone || user.phone,
                fullname: fullname || user.fullname,
                about: about || user.about,
                skills: skills || user.skills
            },
            {
                headers: {
                
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
            // console.log(response.data);
            console.log("check")
            localStorage.setItem("user", JSON.stringify(response.data));
            navigate("/profile");
        } catch (error) {
            console.log(error);
        }
    };
    
  return(
    <>
        <div className="h-[20vh] w-lvw bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 "><p className="flex justify-center items-center text-8xl text-yellow-800 font-serif">Edit Profile</p></div>
        <div className="h-[80vh] w-lvw flex flex-col justify-center items-center relative bg-yellow-200">
            <div className="h-[92%] w-[40%] bg-yellow-300 z-10 translate-y-[-15%]  rounded-md flex flex-col gap-[-10px] border-[2px] border-yellow-700 ">
                <div className="h-[100%] w-[100%] bg-yellow-300 flex justify-evenly items-center rounded-md">
                    <div className="h-[80%] w-[40%] flex flex-col justify-center items-center gap-5">
                        <div className=" h-[30%] w-[53%] bg-yellow-500 rounded-full flex items-center justify-center border-[2px] border-yellow-800"> <img src="../images/user.png" alt="" className="h-[90px] w-[90px]" /></div>
                        <button className="h-[8%] w-[60%] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-md border-[2px] border-yellow-800">Change Photo</button>
                    </div>
                    <div className="w-[0.5px] h-[80%] bg-yellow-900"></div>
                    <div className="h-[80%] w-[44%]  flex flex-col gap-2 justify-center overflow-auto">
                        <div className=" flex flex-col gap-3">
                            <div>
                                <input className="focus:outline-none bg-transparent placeholder-yellow-700 text-yellow-950" type="text" placeholder="Full name" 
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                />
                                <div className="w-[80%] h-[0.5px] bg-red-900"></div>
                            </div>

                            {/* <div>
                                <input className="focus:outline-none bg-transparent placeholder-yellow-700 text-yellow-950" type="email" placeholder="Email"/>
                                <div className="w-[80%] h-[0.5px] bg-red-900"></div>
                            </div> */}

                            <div>
                                <input className="focus:outline-none bg-transparent placeholder-yellow-700 text-yellow-950" type="text" placeholder="Phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                />
                                <div className="w-[80%] h-[0.5px] bg-red-900"></div>
                            </div>

                            <div>
                                <input className="focus:outline-none bg-transparent placeholder-yellow-700 text-yellow-950" type="text" placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                />
                                <div className="w-[80%] h-[0.5px] bg-red-900"></div>
                            </div>

                            <div>
                                <input className="focus:outline-none bg-transparent placeholder-yellow-700 text-yellow-950" type="date" placeholder=""
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                />
                                <div className="w-[80%] h-[0.5px] bg-red-900"></div>
                            </div>

                            <div>
                                <input className="focus:outline-none bg-transparent placeholder-yellow-700 text-yellow-950" type="text" placeholder="education"
                                value={education}
                                onChange={(e) => setEducation(e.target.value)}
                                />
                                <div className="w-[80%] h-[0.5px] bg-red-900"></div>
                            </div>

                            <div>
                                <input className="focus:outline-none bg-transparent placeholder-yellow-700 text-yellow-950" type="text" placeholder="Industry"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                />
                                <div className="w-[80%] h-[0.5px] bg-red-900"></div>
                            </div>
                            <div>
                            <p className="text-yellow-700">About</p>
                            <textarea name="" id="" className="h-[80%] w-[90%] rounded-md focus:outline-none p-1 bg-yellow-400 border-[2px] border-yellow-700 text-yellow-950" 
                            value={skills} 
                            onChange={(e) => setAbout(e.target.value)}
                            ></textarea>
                            </div>
                            <div>
                            <p className="text-yellow-700">Skills</p>
                            <textarea name="" id="" className="h-[80%] w-[90%] rounded-md focus:outline-none p-1 bg-yellow-400 border-[2px] border-yellow-700 text-yellow-950"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            ></textarea>
                            </div>
                            </div>
                    </div>
                    
                </div>

                <div className="w-[83%] h-[7%]  mt-[-5%] mb-[4%] flex justify-end items-end"><button  className="h-[100%] w-[25%] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-md border-[2px] border-yellow-800 " onClick={handleEdit}>Save changes</button></div>
    
            </div>
            
            <div className="footer h-[1vh] w-[100vw] flex flex-row justify-between">
            <div className="foot1 h-[100%] w-[30%] flex flex-row justify-center items-center"><p id="foot_text" className="font-sans font-bold text-xl text-yellow-700">©SkillCase 2024 | Ritam Dutta</p></div>
            <div className="foot2 h-[100%] w-[30%] flex flex-row justify-evenly items-center">
                <div className=" group relative font-segoe-ui text-lg text-yellow-400">
                    <Link to="" className="foot_text2 font-sans text-yellow-700 text-[17px] relative hover:after:scale-x-[1] hover:after:scale-y-[1] ">Contact us</Link>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-700 cursor-pointer transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                </div>
                <div className=" group relative font-segoe-ui text-lg text-yellow-400">
                    <Link to="" className="foot_text2 font-sans text-yellow-700 text-[17px] relative hover:after:scale-x-[1] hover:after:scale-y-[1] ">About us</Link>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-700 cursor-pointer transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                </div>
                <div className=" group relative font-segoe-ui text-lg text-yellow-400">
                    <Link to="" className="foot_text2 font-sans text-yellow-700 text-[17px] relative hover:after:scale-x-[1] hover:after:scale-y-[1] ">Privacy</Link>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-700 cursor-pointer transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                </div>
            </div>
        </div>
        </div>
        
    </>
  )
}

export default Edit