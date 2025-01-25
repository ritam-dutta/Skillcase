import React,{ useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./components/header";
// import Footer from "./components/footer";
import axios from "axios";
import "./App.css"
interface FreelancerProfile {}
const FreelancerProfile : React.FC<FreelancerProfile> = ({})=>{
    const [user, setUser] = useState<any>();

    const url = window.location.href;
    let userType="";
    if(url.includes("freelancer")){
        userType="freelancer"
    }
    else if(url.includes("client")){
        userType="client"
    }

    const[fullname,setFullname]=useState("");
    const[following, setFollowing]=useState(0);
    const[followers, setFollowers]=useState(0);
    const[about,setAbout]=useState("");
    const [skills, setSkills] = useState([""]);
    const [avatar, setAvatar] = useState("");
    const[currentRole,setRole]=useState(userType);
    const {username} = useParams<{ username: string }>();

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const loggedInRole = localStorage.getItem("role") || "";
        // console.log("fetched token",accessToken)
        if (!accessToken) {
            navigate(`/${currentRole}/login`);
        } 

        const fetchUserData = async () => {
            try {
                // console.log(`loggedIn${loggedInRole[0].toUpperCase()}${loggedInRole.slice(1)}`)
                // console.log(currentRole,loggedInRole)
                const responseLoggedUser = await axios.get(`http://localhost:8000/api/v1/${loggedInRole}/loggedIn${loggedInRole[0].toUpperCase()}${loggedInRole.slice(1)}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const responseCurrentUser = await axios.get(`http://localhost:8000/api/v1/${currentRole}/profile/${username}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                // console.log("respone of current user",responseCurrentUser)
                // console.log("response of logged in user",responseLoggedUser)
                let currentUser ;
                let loggedInUser;
                let fetchedUser;
                if(currentRole===loggedInRole){
                    if(currentRole==="freelancer"){
                        currentUser = responseCurrentUser.data?.data?.freelancer;
                        loggedInUser = responseLoggedUser.data?.data?.freelancer;
                    }
                    else if(currentRole==="client"){
                        currentUser = responseCurrentUser.data?.data?.client;
                        loggedInUser = responseLoggedUser.data?.data?.client;
                    } 
                }
                else{
                    if(currentRole==="freelancer"){
                        currentUser = responseCurrentUser.data?.data?.freelancer;
                        loggedInUser = responseLoggedUser.data?.data?.client;
                    }
                    else if(currentRole==="client"){
                        currentUser = responseCurrentUser.data?.data?.client;
                        loggedInUser = responseLoggedUser.data?.data?.freelancer;
                    }
                }  
                // console.log("currentUser",currentUser)
                // console.log("loggedInUser",loggedInUser)
                if(loggedInUser.username === currentUser.username){
                    fetchedUser = loggedInUser;
                }
                else{
                    fetchedUser = currentUser;
                }
                // console.log(fetchedUser)
              
                setUser(fetchedUser);
                setFullname(fetchedUser?.fullname || "");
                setFollowing(fetchedUser?.following || 0);
                setFollowers(fetchedUser?.followers || 0);
                setAbout(fetchedUser?.about || "")  
                setSkills(fetchedUser?.skills || [""]) 
                setAvatar(fetchedUser?.avatar || "/images/freelancer.png") 
                setRole(fetchedUser?.role || "")
            } catch (error) {
                console.error("error fetching user data",error);
                navigate(`/${currentRole}/login`);
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
        
        <div className="min-h-screen w-full bg-gray-100">
      {/* Header */}
      <Header/>
      <div className="h-[18vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-start px-8">
        <h1 className="text-3xl text-white font-bold mt-6">Profile</h1>
      </div>

      <div className="flex flex-row justify-center mt-[-10vh]">
        {/* Sidebar Profile Card */}
        <div className="w-[25%] bg-white shadow-lg rounded-lg p-6 flex flex-col items-center border border-gray-200">

          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center border border-gray-300">
            <img
              src={avatar || "/images/freelancer.png"}
              alt="Profile Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <p className="text-xl font-semibold mt-4">{fullname}</p>
          <p className="text-gray-600">@{username}</p>
          <p className="text-gray-500 mt-2">{userType[0].toUpperCase()+userType.slice(1,)}</p>

          <div className="flex justify-between w-full mt-6 text-center">
            <div>
              <p className="font-semibold text-gray-700">{following}</p>
              <p className="text-gray-500 text-sm">Projects</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">{following}</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">{followers}</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
          </div>

          <div className="w-full mt-6">
            <h3 className="font-semibold text-gray-800">About</h3>
            <textarea
              readOnly
              value={about}
              className="w-full mt-2 p-3 text-sm bg-gray-50 border border-gray-200 rounded-md resize-none"
            ></textarea>
          </div>

          <div className="w-full mt-6">
            <h3 className="font-semibold text-gray-800">Skills</h3>
            <textarea
              readOnly
              value={skills.join("\n")}
              className="w-full mt-2 p-3 text-sm bg-gray-50 border border-gray-200 rounded-md resize-none"
            ></textarea>
          </div>

          <Link
            to={`/${userType}/edit/${username}`}
            className="mt-6 bg-blue-500 text-white text-center px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Edit Profile
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="w-[65%] bg-white shadow-lg rounded-lg p-8 ml-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Stats</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 shadow-sm border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">Stat 1</h3>
            </div>
            <div className="bg-gray-50 p-4 shadow-sm border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">Stat 2</h3>
            </div>
            <div className="bg-gray-50 p-4 shadow-sm border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">Stat 3</h3>
            </div>
          </div>

          {/* Paid Projects */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Paid Projects</h2>
            <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center border border-gray-200">
              <p className="text-gray-600">No data available</p>
            </div>
          </div>

          {/* Unpaid Projects */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Unpaid Projects</h2>
            <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center border border-gray-200">
              <p className="text-gray-600">No data available</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  )
}
export default FreelancerProfile