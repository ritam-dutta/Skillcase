import React,{ useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./components/header";
// import Footer from "./components/footer";
import axios from "axios";
import "./App.css"
interface Profile {}
const Profile : React.FC<Profile> = ({})=>{
    const [user, setUser] = useState<any>();

    const url = window.location.href;
    let userType="";
    if(url.includes("freelancer")){
        userType="freelancer"
    }
    else if(url.includes("client")){
        userType="client"
    }

    const[following, setFollowing]=useState(0);
    const[followers, setFollowers]=useState(0);
    const[about,setAbout]=useState("");
    const [skills, setSkills] = useState([""]);
    const [avatar, setAvatar] = useState("");
    const[role,setRole]=useState(userType);
    const {username} = useParams<{ username: string }>();
    // const[flag,setFlag]=useState(false)

    

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        // console.log(accessToken)
        if (!accessToken) {
            navigate(`/${role}/login`);
        } 

        const fetchUserData = async () => {
            try {
                console.log(username)
                const response = await axios.get(`http://localhost:8000/api/v1/${role}/${username}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                let fetchedUser;
                if(role==="freelancer"){
                    fetchedUser = response.data?.data?.freelancer;
                }
                else if(role==="client"){
                    fetchedUser = response.data?.data?.client;
                }   
                if(username!==fetchedUser.username){
                    navigate(`/${role}/${fetchedUser.username}`)
                }
                console.log(fetchedUser);
                setUser(fetchedUser);
                setFollowing(fetchedUser?.following || 0);
                setFollowers(fetchedUser?.followers || 0);
                setAbout(fetchedUser?.about || "")  
                setSkills(fetchedUser?.skills || [""]) 
                setAvatar(fetchedUser?.avatar || "/images/freelancer.png") 
                setRole(fetchedUser?.role || "")
            } catch (error) {
                console.error("error fetching user data",error);
                navigate(`/${role}/login`);
            }
        };
        fetchUserData();
    }, [navigate]);

    if(!user){
        return <div>Loading...</div>
    }
    // console.log(user.data.freelancer.fullname)
    // export const temp=(s:string)=>({
    //     setAbout({s})
    // })
  return(
    <>
        <Header></Header>
        <div className="h-[18vh] w-lvw bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 "></div>
        <div className="h-[75vh] w-lvw flex justify-between relative bg-slate-100">
            <div className="h-[80%] w-[10%]"></div>
            <div className="h-[90%] w-[20%] bg-yellow-400 z-10 translate-y-[-10%] flex flex-col justify-between items-center border-[2px] border-yellow-800 rounded-md">
                <div className="h-[35%] w-[100%] bg-yellow-300 flex flex-col justify-center items-center rounded-md">
                    <p>{role}</p>
                  <div className="h-[50%] w-[30%] rounded-full bg-yellow-400 border-[2px] border-yellow-800 flex justify-center items-center "><img src={avatar || "/images/freelancer.png"} alt="" className="h-[99%] w-[99%] rounded-full" /></div>
                  <p className="text-yellow-900">{user.fullname}</p>
                  <p className="text-yellow-900">{user.username}</p>
                </div>
                <div className="h-[70%] w-[100%] bg-yellow-300 rounded-md">
                    <div className="flex justify-between px-3">
                        <p className="text-yellow-900">Following</p>
                        <p>{following}</p>
                    </div>
                    <div className=" flex justify-center"><div className="h-[1.5px] w-[95%] bg-yellow-700"></div></div>
                    <div className="flex justify-between px-3 mt-3">
                        <p className="text-yellow-900">Followers</p>
                        <p>{followers}</p>
                    </div>
                    <div className=" flex justify-center"><div className="h-[1.5px] w-[95%] bg-yellow-700"></div></div>
                    <div className="mt-4 h-[75%] w-[100%] flex flex-col items-center ">
                        <div className="flex justify-between px-2 w-[100%] h-[15%]">
                            <p className="text-yellow-900">About</p>
                        </div>
                        <div className=" h-[40%] w-[90%] rounded-md ">                       
                            <textarea id="myInput" readOnly value={about} className="focus:outline-none h-[100%] w-[100%] rounded-md p-2 bg-yellow-400 border-[2px] border-yellow-700 text-yellow-950 resize-none"/>
                        </div>
                        <div className="flex justify-between px-2 w-[100%] h-[20%] mt-3">
                            <p className="text-yellow-900">Skills</p>   
                        </div>
                        <div className=" h-[40%] w-[90%] rounded-md">
                            <textarea id="myInput" readOnly className="focus:outline-none h-[100%] w-[100%] rounded-md p-2 bg-yellow-400 border-[2px] border-yellow-700 text-yellow-950 resize-none"
                            value={skills.join("\n")}
                            />
                        </div>
                        <div className="w-[30%] h-[20%] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 border-[2px] border-yellow-800 mt-2 rounded-md flex justify-center items-center"> <Link to={`/${userType}/${username}/edit`}>Edit profile</Link></div>

                    </div>
                </div>
            </div>
            <div className=" h-[97%] w-[65%] bg-slate-100 overflow-auto px-4 py-2 my-2 rounded-md">
                <p className=" pt-2 text-xl font-sans text-">Stats</p>
                <div className="h-[20%] w-[100%]  flex justify-evenly">
                    <div className="stat h-[100%] w-[25%] bg-yellow-200 rounded-md ">

                    </div>
                    <div className="stat h-[100%] w-[25%] bg-yellow-200 rounded-md ">

                    </div>
                    <div className="stat h-[100%] w-[25%] bg-yellow-200 rounded-md ">
                    </div>
                </div>
                <div className=" h-[60%] w-[100%]  mt-4">
                    <p className=" text-xl font-sans pb-1">Paid projects</p>
                    <div className="h-[91%] w-[100%] flex justify-center items-center">
                        <div className="no-scrollbar h-[100%] w-[97%] bg-gray-400 border-[1px] border-[black] rounded-md">
                            
                        </div>

                    </div>
                </div>
                <div className=" h-[60%] w-[100%]  mt-4">
                    <p className=" text-xl font-sans pb-1">Unpaid projects</p>
                    <div className="h-[91%] w-[100%] flex justify-center items-center">
                        <div className="no-scrollbar h-[100%] w-[97%] bg-gray-400 border-[1px] border-[black] rounded-md">
                            
                        </div>

                    </div>
                </div>
                <div className="h-[5%]"></div>
            </div>
        </div>

    </>
  )
}
export default Profile