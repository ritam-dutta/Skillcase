import React,{ useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./components/header";
import Loader from "./components/loader";
import axios from "axios";
import "./App.css"
interface ClientProfile {}
const ClientProfile : React.FC<ClientProfile> = ({})=>{

    const url = window.location.href;
    let userType="";
    if(url.includes("freelancer")){
        userType="freelancer"
    }
    else if(url.includes("client")){
        userType="client"
    }

    const [user, setUser] = useState<any>();
    const [projects, setProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [inProgressProjects, setInProgressProjects] = useState([]);
    const[fullname,setFullname]=useState("");
    const[following, setFollowing]=useState(0);
    const[followers, setFollowers]=useState(0);
    const[connections,setConnections]=useState(0);
    const[about,setAbout]=useState("");
    const[experience, setExperience]=useState("");
    const [avatar, setAvatar] = useState("");
    const[currentRole,setRole]=useState(userType);
    const {username} = useParams<{ username: string }>();
    const [loggedUsername, setLoggedUsername] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const loggedInRole = localStorage.getItem("role") || "";
        // console.log("fetched token",accessToken)
        if (!accessToken) {
            navigate(`/${currentRole}/login`);
        } 

        const fetchUserData = async () => {
            setLoading(true);
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
                setLoggedUsername(loggedInUser.username);
                // console.log("currentUser",currentUser)
                // console.log("loggedInUser",loggedInUser)
                if(loggedInUser.username === currentUser.username){
                    fetchedUser = loggedInUser;
                }
                else{
                    fetchedUser = currentUser;
                    if(fetchedUser.followers.includes(loggedInUser.username)){
                        setIsFollowing(true);
                    }
                    if(fetchedUser.connections.includes(loggedInUser.username)){
                        setIsConnected(true);
                    }
                }
                // console.log(fetchedUser)
              
                setUser(fetchedUser);
                setFullname(fetchedUser?.fullname || "");
                setFollowing(fetchedUser?.following.length || 0);
                setFollowers(fetchedUser?.followers.length || 0);
                setConnections(fetchedUser?.connections.length || 0);
                setAbout(fetchedUser?.about || "")  
                setExperience(fetchedUser?.experience || "")
                setAvatar(fetchedUser?.avatar || "/images/freelancer.png") 
                setRole(fetchedUser?.role || "")
            } catch (error) {
                console.error("error fetching user data",error);
                navigate(`/${currentRole}/login`);
            }
            setLoading(false);
        };
        fetchUserData();
        const fetchUserProjects = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8000/api/v1/root/getuserprojects",{
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        username: username,
                    }
                });

                const projects = response.data.data;
                // console.log("prj",projects)
                setProjects(projects);
                let cp = projects.filter((project) => project.status === "Completed");
                let ip = projects.filter((project) => project.status === "In Progress");
                setCompletedProjects(cp);
                setInProgressProjects(ip);
            } catch (error) {
                console.error("Fetch Projects Error:", error);
            }
            setLoading(false);
        };

        fetchUserProjects();
    }, [navigate]);
    // console.log("following",isFollowing)
    const handleFollow = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.post(`http://localhost:8000/api/v1/client/follow/${username}`, {
                username: username,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setIsFollowing(true);
            setFollowers(followers+1);
            // console.log("Follow Response:", response.data);
        } catch (error) {
            console.error("Follow Error:", error);
        }
    };

    const handleUnFollow = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.post(`http://localhost:8000/api/v1/client/unfollow/${username}`, {
                username: username,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setIsFollowing(false);
            setFollowers(followers-1);
            // console.log("UnFollow Response:", response.data);
        } catch (error) {
            console.error("UnFollow Error:", error);
        }
    }

    const handleConnect = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.post(`http://localhost:8000/api/v1/client/connect/${username}`, {
                username: username,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setIsConnected(true);
            setConnections(connections+1);
            // console.log("Connect Response:", response.data);
        } catch (error) {
            console.error("Connect Error:", error);
        }
    }

    const handleDisconnect = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.post(`http://localhost:8000/api/v1/client/disconnect/${username}`, {
                username: username,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setIsConnected(false);
            setConnections(connections-1);
            // console.log("Disconnect Response:", response.data);
        } catch (error) {
            console.error("Disconnect Error:", error);
        }
    }


    let notStarted=0;
    let inProgress=0;
    let onHold=0;
    let completed=0;
    let cancelled=0;
    let total=projects.length;
    projects.map((project)=>{
        if(project.status==="Not Started"){
            notStarted++;
        }
        else if(project.status==="In Progress"){
            inProgress++;
        }
        else if(project.status==="On Hold"){
            onHold++;
        }
        else if(project.status==="Completed"){
            completed++;
        }
        else if(project.status==="Cancelled"){
            cancelled++;
        }
    })
    console.log("currentuser", username)
    console.log("loggeduser", loggedUsername)

  return(
    <>
        
        <div className="min-h-screen w-full bg-gray-100">
      {/* Header */}
      <Header/>
      <div className="h-[18vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-start px-8">
        <h1 className="text-3xl text-white font-bold mt-6">Profile</h1>
      </div>
        {!loading ? (
      <div className="flex flex-row justify-center mt-[-10vh]">
        {/* Sidebar Profile Card */}
        <div className="w-[25%] h-[83vh] bg-slate-50 shadow-lg rounded-lg p-6 flex flex-col items-center border border-gray-200">

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

        {username === loggedUsername ? (
            <div className="flex justify-evenly w-full mt-6 text-center">
                    <div>
                    <p className="font-semibold text-gray-700">{connections}</p>
                    <p className="text-gray-500 text-sm">Connections</p>
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
            ):(
            <div className="flex flex-col justify-evenly w-full mt-4 text-center">
                <div className="flex justify-evenly">
                    <div>
                    <p className="font-semibold text-gray-700">{connections}</p>
                    <p className="text-gray-500 text-sm">Connections</p>
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
                <div className="flex justify-evenly">
                    <div>
                    <button className={isConnected ? "mt-6 bg-gray-200 text-blue-950 text-center px-4 py-2 rounded-lg shadow-md" : "mt-6 bg-blue-500 text-white text-center px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition" } onClick={() => {isConnected ? handleDisconnect() : handleConnect()}}>{isConnected ? "Connected" : "Connect"}</button>
                    </div>
                    <div>
                    <button className={isFollowing ? "mt-6 bg-gray-200 text-blue-950 text-center px-4 py-2 rounded-lg shadow-md" :"mt-6 bg-blue-500 text-white text-center px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"} onClick={() =>{isFollowing ? handleUnFollow() : handleFollow()}}>{isFollowing ? "Followed" : "Follow"}</button>
                    </div>
                </div>
                
          </div>
            )
            }

          <div className="w-full mt-6">
            <h3 className="font-semibold text-gray-800">About</h3>
            <textarea
              readOnly
              value={about}
              className="w-full mt-2 p-3 text-sm bg-gray-200 border border-gray-200 rounded-md resize-none outline-none"
            ></textarea>
          </div>

          <div className="w-full mt-6">
            <h3 className="font-semibold text-gray-800">Experience</h3>
            <textarea
              readOnly
              value={experience}
              className="w-full mt-2 p-3 text-sm bg-gray-200 border border-gray-200 rounded-md resize-none outline-none"
            ></textarea>
          </div>
            {username === loggedUsername ?
            (<Link
                to={`/${userType}/edit/${username}`}
                className="mt-6 bg-blue-500 text-white text-center px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
            >
                Edit Profile
            </Link>)
            :null
          }
        </div>

        {/* Main Content Area */}
        <div className="w-[65%] h-[83vh] bg-slate-50 shadow-lg rounded-lg p-8 ml-6 border border-gray-200 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Projects Status</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">Completed: {completed}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">Not Started: {notStarted}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">In Progress: {inProgress}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">On Hold: {onHold}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">Cancelled: {cancelled}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">Total: {total}</h3>
            </div>
          </div>

          {/* In Progress Projects */}
          <h2 className="text-xl font-semibold mb-3 text-black"> Projects In Progress</h2>
        <div className="mb-8 overflow-auto bg-gray-100 px-4 py-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressProjects.length > 0 ? (
                inProgressProjects.map((project) => (
                    <div
                        key={project._id}
                        className="bg-slate-50 border border-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition"
                    >
                        <div className="w-full flex justify-between items-end ">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 truncate">
                                    {project.description || "No description provided."}
                                </p>
                            </div>
                            <div>
                                <button
                                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition mr-1"
                                    onClick={() => navigate(`/${userType}/view_project/${project._id}`)}
                                    >
                                    View Project
                                </button>
                            </div>
                        </div>
                        {username === loggedUsername ? (    
                            <div className="mt-4 flex items-center justify-between gap-4">
                                <span className="text-sm text-blue-500 font-medium">
                                {project.industry || "Uncategorized"}
                                </span>
                                <button
                                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition w-2/4"
                                onClick={() => navigate(`/client/edit_project/${username}/${project._id}`)}
                                >
                                Edit Project
                                </button>
                            </div>)
                            :null
                        }
                        
                    </div>
                ))
                ) : (
                <div className="col-span-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">No completed projects available</p>
                </div>
                )}
            </div>
        </div>


          {/* Completed Projects */}
          <h2 className="text-xl font-semibold mb-3 text-blue-700">Completed Projects</h2>
        <div className="mb-8 overflow-auto bg-gray-100 px-4 py-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedProjects.length > 0 ? (
                completedProjects.map((project) => (
                    <div
                        key={project._id}
                        className="bg-slate-50 border border-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition"
                    >
                        <div className="w-full flex justify-between items-end">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 truncate">
                                    {project.description || "No description provided."}
                                </p>
                            </div>
                            <div>
                                <button
                                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition mr-1"
                                    onClick={() => navigate(`/${userType}/view_project/${project._id}`)}
                                    >
                                    View Project
                                </button>
                            </div>
                        </div>
                        {/* <p className="text-sm text-gray-600 mt-1 truncate">
                            {project.status || "No status provided."}
                        </p> */}
                        {username === loggedUsername ? (    
                            <div className="mt-4 flex items-center justify-between gap-4">
                                <span className="text-sm text-blue-500 font-medium">
                                {project.industry || "Uncategorized"}
                                </span>
                                <button
                                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition w-2/4"
                                onClick={() => navigate(`/client/edit_project/${username}/${project._id}`)}
                                >
                                Edit Project
                                </button>
                            </div>)
                            :null
                        }
                    </div>
                ))
                ) : (
                <div className="col-span-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">No completed projects available</p>
                </div>
                )}
            </div>
        </div>
            <div className="w-full flex justify-center items-center">
                <button
                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition w-1/6"
                    onClick={() => navigate(`/client/view_projects/${username}`)}
                    >
                    View All Projects
                </button>
            </div>
      </div>
    {/* <Footer/> */}
    </div>):
    (
        <div className="h-[70vh] w-full flex justify-center items-center">
            <div className="h-[70vh] w-[50vw] flex justify-center items-center bg-slate-50">
                <Loader />
            </div>
        </div>
    )
    }
            
    </div>

    </>
  )
}
export default ClientProfile