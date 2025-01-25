import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./footer"; 
import axios from "axios";
import "../App.css";

interface Edit {}
const Edit: React.FC<Edit> = ({})=> {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>();
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
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
        if (!accessToken) {
            console.log("Access token not found");
            navigate(`/${role}/${username}`);
        }
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
                if (role === "freelancer") {
                    currentUser = responseCurrentUser.data?.data?.freelancer;
                    loggedInUser = responseLoggedUser.data?.data?.freelancer;
                } else if (role === "client") {
                    currentUser = responseCurrentUser.data?.data?.client;
                    loggedInUser = responseLoggedUser.data?.data?.client;
                }

                if (loggedInUser.username === currentUser.username) {
                    fetchedUser = loggedInUser;
                } else {
                    navigate(`/${role}/profile/${username}`);
                }

                if (!fetchedUser) {
                    navigate(`/${role}/profile/${username}`);
                }

                setUser(fetchedUser);
                setFullname(fetchedUser?.fullname || "");
                setPhone(fetchedUser?.phone || "");
                setDob(fetchedUser?.dob || "");
                setEducation(fetchedUser?.education || "");
                setIndustry(fetchedUser?.industry || "");
                setAbout(fetchedUser?.about || "");
                setSkills(fetchedUser?.skills || "");
                setAvatar(fetchedUser?.avatar || "/images/freelancer.png");
            } catch (error) {
                console.error("Error fetching user data", error);
                navigate(`/${role}/profile/${username}`);
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        setAvatarFile(file);
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await axios.post(
            `http://localhost:8000/api/v1/${role}/update_avatar/${username}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        const updatedAvatar = response.data?.data?.freelancer?.avatar || "/images/freelancer.png";
        if (avatarFile) setAvatar(updatedAvatar);
    };

    const changeAvatar = async () => {
        try {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {
                handleAvatarChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
            };
            document.body.appendChild(input);
            input.click();
            input.remove();
        } catch (error) {
            console.error("Error updating avatar", error);
        }
    };

    const removeAvatar = async () => {
        try {
            if (avatar === "/images/freelancer.png" || !avatar) return;
            if (!window.confirm("Are you sure you want to remove your avatar?")) {
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
    };

    const handleEdit = async () => {
        if (!user) {
            console.error("User token is missing or invalid.");
            return;
        }

        try {
            await axios.post(
                `http://localhost:8000/api/v1/${role}/update_account/${username}`,
                {
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
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(about)
            navigate(`/${role}/profile/${username}`);
        } catch (error) {
            console.log(error);
        }
    };

    const cancelChanges = () => {
        if(window.confirm("Are you sure you want to discard the changes?")){
            navigate(`/${role}/profile/${username}`);
        }
    }

    return (
        <>
            <div className="h-[12vh] w-full bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-700 shadow-lg">
                <p className="flex justify-center items-center text-4xl font-semibold text-gray-50 py-4">Edit Profile</p>
            </div>
            <div className="min-h-[88vh] w-full flex flex-col items-center bg-gray-50 py-6">
                <div className="w-11/12 lg:w-3/5 bg-white shadow-lg rounded-lg p-8">
                    <div className="flex justify-between items-start">
                        <div className="w-1/3 flex flex-col items-center gap-4">
                            <div className="h-32 w-32 rounded-full overflow-hidden border border-gray-300">
                                <img src={avatar || "/images/freelancer.png"} alt="Avatar" className="h-full w-full object-cover" />
                            </div>
                            <button 
                                className="w-[75%] px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                onClick={changeAvatar}>
                                Change Photo
                            </button>
                            <button 
                                className="w-[75%] px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                onClick={removeAvatar}>
                                Remove Photo
                            </button>
                        </div>
                        <div className="w-2/3 px-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="mt-1 block w-full rounded-md border-gray-300 border-b-[2px] shadow-sm  focus:outline-none  focus:shadow-md px-1" 
                                        value={fullname}
                                        onChange={(e) => setFullname(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input 
                                        type="text" 
                                        className="mt-1 block w-full rounded-md border-gray-300 border-b-[2px] shadow-sm  focus:outline-none  focus:shadow-md px-1" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                    <input 
                                        type="date" 
                                        className="mt-1 block w-full rounded-md border-gray-300 border-b-[2px] shadow-sm  focus:outline-none  focus:shadow-md px-1" 
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Education</label>
                                    <input 
                                        type="text" 
                                        className="mt-1 block w-full rounded-md border-gray-300 border-b-[2px] shadow-sm  focus:outline-none  focus:shadow-md px-1" 
                                        value={education}
                                        onChange={(e) => setEducation(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                                    <input 
                                        type="text" 
                                        className="mt-1 block w-full rounded-md border-gray-300 border-b-[2px] shadow-sm  focus:outline-none  focus:shadow-md px-1" 
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">About</label>
                                    <textarea 
                                        className="mt-1 block w-full rounded-md border-gray-300 border-b-[2px] shadow-sm  focus:outline-none  focus:shadow-md px-1 resize-none" 
                                        value={about} 
                                        onChange={(e) => setAbout(e.target.value)}
                                    />
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700">Skills</label>
                                    <div className="flex items-center gap-2 mb-2">
                                        <input 
                                            type="text" 
                                            className="flex-1 rounded-md border-gray-300 border-b-[2px] shadow-sm  focus:outline-none  focus:shadow-md px-1" 
                                            placeholder="Add a skill"
                                            value={searchedSkill}
                                            onChange={(e) => setSearchedSkill(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && searchedSkill.trim() !== "") {
                                                    setSkills([...skills, searchedSkill.trim()]);
                                                    setSearchedSkill("");
                                                }
                                            }}
                                        />
                                        <button 
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                            onClick={() => {
                                                if (searchedSkill.trim() !== "") {
                                                    setSkills([...skills, searchedSkill.trim()]);
                                                    setSearchedSkill("");
                                                }
                                            }}>
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <div 
                                                key={index} 
                                                className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
                                                <span>{skill}</span>
                                                <button 
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => setSkills(skills.filter((_, i) => i !== index))}>
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}
                            </div>
                            <div className="mt-6 flex justify-end gap-4">
                                <button 
                                    className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                                    onClick={cancelChanges}>
                                    Cancel
                                </button>
                                <button 
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    onClick={handleEdit}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />  
        </>
    );
};

export default Edit;

