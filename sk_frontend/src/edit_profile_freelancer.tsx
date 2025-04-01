import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/header";
// import Footer from "./components/footer"; 
import { Skeleton } from "./components/ui/skeleton";
import axios from "axios";

interface EditFreelancer {}
const EditFreelancer: React.FC<EditFreelancer> = ({})=> {
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
    // const [searchedSkill, setSearchedSkill] = useState("");
    const [avatar, setAvatar] = useState<string | null>("/images/freelancer.png");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    const url = window.location.href;
    const role = url.includes("freelancer") ? "freelancer" : "client";

    useEffect(() => {
        setLoading(true);
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
        setTimeout(() => setLoading(false), 200);
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
        <div className="h-full w-full bg-[url('/images/background.jpg')] bg-cover bg-center">
    <Header />
    <div className="h-[14vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-start px-6 sm:px-8">
        <h1 className="text-2xl sm:text-3xl text-white font-bold mt-6">Edit Profile</h1>
    </div>

    <div className="flex flex-col lg:flex-row justify-center lg:mt-[-10vh] px-6 sm:px-8">
        {/* Main Content Area */}
        <div className="min-h-[88vh] w-full flex flex-col items-center py-6">
            {!loading ? (
                <div className="w-full lg:w-3/5 bg-slate-100 shadow-lg rounded-lg p-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start">
                        {/* Avatar and Photo Controls */}
                        <div className="w-full lg:w-1/3 flex flex-col items-center gap-4 mb-6 lg:mb-0">
                            <div className="h-32 w-32 rounded-full overflow-hidden border-gray-300 border-[2px]">
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
                        {/* Form Section */}
                        <div className="w-full lg:w-2/3 px-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="mt-1 block w-full rounded-md bg-slate-50 border-blue-300 border-[1px] shadow-sm focus:outline-none focus:shadow-md px-1" 
                                        value={fullname}
                                        onChange={(e) => setFullname(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input 
                                        type="text" 
                                        className="mt-1 block w-full rounded-md bg-slate-50 border-blue-300 border-[1px] shadow-sm focus:outline-none focus:shadow-md px-1" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                    <input 
                                        type="date" 
                                        className="mt-1 block w-full rounded-md bg-slate-50 border-blue-300 border-[1px] shadow-sm focus:outline-none focus:shadow-md px-1" 
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                                    <input 
                                        type="text" 
                                        className="mt-1 block w-full rounded-md bg-slate-50 border-blue-300 border-[1px] shadow-sm focus:outline-none focus:shadow-md px-1" 
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">About</label>
                                    <textarea 
                                        className="mt-1 block w-full rounded-md bg-slate-50 border-blue-300 border-[1px] shadow-sm focus:outline-none focus:shadow-md px-1 resize-none" 
                                        value={about} 
                                        onChange={(e) => setAbout(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Education</label>
                                    <input 
                                        type="text" 
                                        className="mt-1 block w-full rounded-md border-gray-300 border-b-[2px] shadow-sm focus:outline-none focus:shadow-md px-1" 
                                        value={education}
                                        onChange={(e) => setEducation(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-4">
                                <button 
                                    className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                                    onClick={cancelChanges}>
                                    Cancel
                                </button>
                                <button 
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    onClick={() => window.confirm("Are you sure you want to save the changes?") && handleEdit()}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full lg:w-3/5 bg-white shadow-lg rounded-lg p-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start">
                        <div className="w-full lg:w-1/3 flex flex-col items-center gap-4 mb-6 lg:mb-0">
                            <Skeleton style={{ height: 128, width: 128, borderRadius: '50%' }} />
                            <Skeleton style={{ height: 40, width: 120 }} />
                            <Skeleton style={{ height: 40, width: 120 }} />
                        </div>
                        <div className="w-full lg:w-2/3 px-6 space-y-2">
                            <Skeleton style={{ height: 20, width: 100 }} />
                            <Skeleton style={{ height: 40, width: "100%" }} />
                            <Skeleton style={{ height: 20, width: 100 }} />
                            <Skeleton style={{ height: 40, width: "100%" }} />
                            <Skeleton style={{ height: 20, width: 100 }} />
                            <Skeleton style={{ height: 40, width: "100%" }} />
                            <Skeleton style={{ height: 20, width: 100 }} />
                            <Skeleton style={{ height: 40, width: "100%" }} />
                            <Skeleton style={{ height: 20, width: 100 }} />
                            <Skeleton style={{ height: 40, width: "100%" }} />
                            <Skeleton style={{ height: 20, width: 100 }} />
                            <Skeleton style={{ height: 80, width: "100%" }} />
                            <div className="mt-6 flex justify-end gap-4">
                                <Skeleton style={{ height: 40, width: 100 }} />
                                <Skeleton style={{ height: 40, width: 120 }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>          
    </div>
</div>

    );
};

export default EditFreelancer;

