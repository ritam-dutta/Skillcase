import { useNavigate, useParams} from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./footer"; 
import axios from "axios";
import "../App.css"
interface Edit {}

const Edit : React.FC<Edit> = ({})=>{
    const {username} = useParams<{ username: string }>();
    const navigate = useNavigate();
    const[user,setUser]=useState<any>();
    const [fullname, setFullname] = useState("");	
    const [phone, setPhone] = useState("");
    // const [username, setUsername] = useState("");
    const [dob, setDob] = useState("");
    const [education, setEducation] = useState("");
    const [industry, setIndustry] = useState("");
    const [about, setAbout] = useState(""); 
    const [skills, setSkills] = useState([""]);
    const [searchedSkill, setSearchedSkill] = useState("");
    const [avatar, setAvatar] = useState<string | null>("/images/freelancer.png");
    const [avatarFile, setAvatarFile] = useState<File | null>(null); 

    const [token, setToken] = useState("");

    const url = window.location.href;
    const role = url.includes("freelancer") ? "freelancer" : "client";
  
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if(!accessToken){
            console.log("Access token not found")	
            navigate(`/${role}/${username}`)
        }
        // console.log(accessToken)
        if (accessToken) {
            setToken(accessToken);
        }

        const fetchUserData = async () => {
            try {
                const responseLoggedUser = await axios.get(`http://localhost:8000/api/v1/${role}/loggedIn${role[0].toUpperCase()}${role.slice(1)}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const responseCurrentUser = await axios.get(`http://localhost:8000/api/v1/${role}/profile/${username}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                
                let currentUser;
                let loggedInUser;
                let fetchedUser;
                if(role==="freelancer"){
                    currentUser = responseCurrentUser.data?.data?.freelancer;
                    loggedInUser = responseLoggedUser.data?.data?.freelancer;
                }
                else if(role==="client"){
                    currentUser = responseCurrentUser.data?.data?.client;
                    loggedInUser = responseLoggedUser.data?.data?.client;
                }

                if(loggedInUser.username === currentUser.username){
                    fetchedUser = loggedInUser;
                }
                else{
                    navigate(`/${role}/profile/${username}`);
                }

                if(!fetchedUser){
                    navigate(`/${role}/profile/${username}`);
                }
                // console.log(username, fetchedUser.username)
                setUser(fetchedUser);
                setFullname(fetchedUser?.fullname || "");
                setPhone(fetchedUser?.phone || "");
                // setUsername(fetchedUser?.username || "");
                setDob(fetchedUser?.dob || "");
                setEducation(fetchedUser?.education || "");
                setIndustry(fetchedUser?.industry || "");
                setAbout(fetchedUser?.about || "");
                setSkills(fetchedUser?.skills || "");
                setAvatar(fetchedUser?.avatar || "/images/freelancer.png");
                // console.log("done axios")
                // console.log(freelancer)
                // setUser(freelancer);
                // setFollowing(freelancer?.following || 0);
                // setFollowers(freelancer?.followers || 0);
                // setAbout(freelancer?.about || "")    
            } catch (error) {
                console.error("error fetching user data",error);
                navigate(`/${role}/profile/${username}`);
            }
        };
        fetchUserData();
    }, [navigate]); 

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file){
            return <div> loading...</div>
        }
        if (file) {
            setAvatarFile(file);
        }
        const formData = new FormData();
            if (file) {
                formData.append("avatar", file);
            }
            const response = await axios.post(`http://localhost:8000/api/v1/${role}/update_avatar/${username}`,formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            });
            const updatedAvatar = response.data?.data?.freelancer?.avatar || "/images/freelancer.png";
            // console.log("Avatar updated");
            if(avatarFile) setAvatar(updatedAvatar);
    };

    const changeAvatar = async () => {
        if(!avatar){
            console.log("Avatar not found")
            return;
        }
        try {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {handleAvatarChange(e as unknown as React.ChangeEvent<HTMLInputElement>)};
            document.body.appendChild(input);
            input.click();
            input.remove();
        } catch (error) {
            console.error("Error updating avatar", error);
            
        }
    }

    const removeAvatar = async () => {
        try {
            // console.log(avatar)
            if(avatar=="/images/freelancer.png" || !avatar) return;
            if(!window.confirm("Are you sure you want to remove your avatar?")){
                return;
            } 
            await axios.post(
                `http://localhost:8000/api/v1/${role}/update_avatar/${username}`,
                { avatar: null },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAvatar(null);
        } catch (error) {
            console.error("Error removing avatar:", error);
        }
    }


    const handleEdit = async () => {
    
        // console.log(user.data.accessToken)
        // console.log("handleedit")
        if (!user) {
            console.error("User token is missing or invalid.");
            return;
        }
        
        try {
            // console.log("update enter")
            const response = await axios.post(`http://localhost:8000/api/v1/${role}/update_account/${username}`, {
                username: username || user.username,
                dob: dob || user.dob,
                education: education || user.education,
                industry: industry || user.industry,
                phone: phone || user.phone,
                fullname: fullname || user.fullname,
                about: about || user.about,
                skills: skills || user.skills,
                avatar: avatar || user.avatar,
            },
            {
                headers: {
                
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
            console.log(response.data?.data?.freelancer.fullname);
            // console.log("check")
            navigate(`/${role}/profile/${username}`);
        } catch (error) {
            console.log(error);
        }
    };
    
  return(
    <>
        <div className="h-[12vh] w-lvw bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 "><p className="flex justify-center items-center text-8xl text-yellow-800 font-serif">Edit Profile</p></div>
        <div className="h-[88vh] w-lvw flex flex-col justify-center items-center relative bg-yellow-200 ">
            <div className="h-[100%] w-[40%] bg-yellow-300 z-10 translate-y-[-2%]  rounded-md flex flex-col gap-[-10px] border-[2px] border-yellow-700">
                <div className="h-[100%] w-[100%] bg-yellow-300 flex justify-evenly items-center rounded-md">
                    <div className="h-[80%] w-[40%] flex flex-col justify-center items-center gap-5">
                        <div className=" h-[30%] w-[56%] bg-yellow-500 rounded-full flex items-center justify-center border-[2px] border-yellow-800"> 
                            {/* <input 
                            type="file" 
                            id="avatarInput" 
                            accept="image/*" 
                            onChange={handleAvatarChange} 
                            /> */}
                        <img src={avatar || "/images/freelancer.png"} alt="" className="h-[98%] w-[98%] rounded-full"/>
                            </div>
                        <button className="h-[8%] w-[60%] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-md border-[2px] border-yellow-800" 
                        onClick={changeAvatar}>
                            Change Photo
                        </button>
                        <button className="h-[8%] w-[60%] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-md border-[2px] border-yellow-800" 
                        onClick={removeAvatar}>
                            Remove Photo	
                        </button>
                    </div>
                    <div className="w-[0.5px] h-[80%] bg-yellow-900"></div>
                    <div className="h-[80%] w-[44%]  flex flex-col gap-2 justify-center overflow-y-auto ">
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

                            {/* <div>
                                <input className="focus:outline-none bg-transparent placeholder-yellow-700 text-yellow-950" type="text" placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                />
                                <div className="w-[80%] h-[0.5px] bg-red-900"></div>
                            </div> */}

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
                            <textarea name="" id="" className="h-[80%] w-[90%] rounded-md focus:outline-none p-1 bg-yellow-400 border-[2px] border-yellow-700 text-yellow-950 resize-none" 
                            value={about} 
                            onChange={(e) => setAbout(e.target.value)}
                            ></textarea>
                            </div>
                            <div>
                            <p className="text-yellow-700">Skills</p>
                            <div className="border-black bg-yellow-600 bg-opacity-55 placeholder-yellow-700 text-yellow-950 h-7 w-56 p-2 flex justify-left items-center rounded-md">
                                <input className="w-[100%] bg-transparent placeholder-yellow-800 text-yellow-950 focus:outline-none text-sm" type="text" placeholder="Type your skill and press enter " 
                                value={searchedSkill}
                                onChange={(e) => {
                                    setSearchedSkill(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && searchedSkill) {
                                        setSkills([...skills, searchedSkill]);
                                        setSearchedSkill("");
                                    }
                                }}
                                />
                            </div>
                            {/* <textarea name="" id="" readOnly className="h-[80%] w-[90%] rounded-md focus:outline-none p-1 bg-yellow-400 border-[2px] border-yellow-700 text-yellow-950 mt-1 "
                            value={skills.join("\n")}
                            {...skills.map((skill, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span>{skill}</span>
                                    <button
                                        className="ml-2 bg-red-500 text-white rounded px-2"
                                        onClick={() => {
                                            const newSkills = skills.filter((_, i) => i !== index);
                                            setSkills(newSkills);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            ></textarea> */}
                            <div className="h-[80%] w-[90%] rounded-md focus:outline-none p-1 bg-yellow-400 border-[2px] border-yellow-700 text-yellow-950 mt-1 overflow-y-auto">
                                {skills.map((skill, index) => (
                                    <div key={index} className="flex justify-between items-center p-1 border-b border-yellow-500">
                                        <span>{skill}</span>
                                        <button
                                            className=" bg-transparent text-red-600 rounded-md p-1 text-sm"
                                            onClick={() => {
                                                const newSkills = skills.filter((_, i) => i !== index);
                                                setSkills(newSkills);
                                            }}
                                        >
                                            remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            </div>
                            </div>
                    </div>
                    
                    
                </div>

                <div className="w-[83%] h-[7%]  bg-yellow-300  flex justify-end items-end">
                    <button  className="h-[100%] w-[25%] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-md border-[2px] border-yellow-800 -translate-y-7" onClick={handleEdit}>Save changes
                    </button>
                </div>
    
            </div>
            <Footer></Footer>
            {/* <div className="footer h-[1vh] w-[100vw] flex flex-row justify-between">
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
            </div> */}
        </div>
        
    </>
  )
}

export default Edit