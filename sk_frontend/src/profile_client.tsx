import React,{ useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Skeleton } from "./components/ui/skeleton";
import Header from "./components/header";
// import Loader from "./components/loader";
import axios from "axios";
import "./App.css"
import { useSocket } from "./context/socket.context";
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

    const socket = useSocket();
    const navigate = useNavigate();
    // const [user, setUser] = useState<any>();
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
    const [loading, setLoading] = useState(true);
    const [connectionRequest, setConnectionRequest] = useState(false);
    const accessToken = localStorage.getItem("accessToken");
    const loggedInRole = localStorage.getItem("role") || "";

    useEffect(() => {
        socket?.on("accept connection", (response) => {
            console.log("connection accepted", response);
            setConnectionRequest(false);
            setIsConnected(true);
        });

        socket?.on("reject connection", (response) => {
            console.log("connection rejected", response);
            setConnectionRequest(false);
            setIsConnected(false);
        });

        return () => {
            socket?.off("accept connection");
            socket?.off("reject connection");
        }
    }, [socket]);

    useEffect(() => {
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
                let loggedInUser: any;
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
                localStorage.setItem("username",loggedInUser.username);
                setLoggedUsername(loggedInUser.username);
                // console.log("currentUser",currentUser)
                // console.log("loggedInUser",loggedInUser)
                if(loggedInUser.username === currentUser.username){
                    fetchedUser = loggedInUser;
                }
                else{
                    fetchedUser = currentUser;
                    if(fetchedUser.followers && fetchedUser.followers.some((follower: { username: string }) => follower.username === loggedInUser.username)){
                        setIsFollowing(true);
                    }
                    if(fetchedUser.notifications && fetchedUser.notifications.some((notification: { type: string; sender: string }) => notification.type === "connection_request" && notification.sender === loggedInUser.username)){
                        setConnectionRequest(true);
                    }
                    if(fetchedUser.connections && fetchedUser.connections.some((connection: { username: string }) => connection.username === loggedInUser.username)){
                        setIsConnected(true);
                    }
                }
                // console.log(fetchedUser)
              
                // setUser(fetchedUser);
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
        };
        fetchUserData();
        const fetchUserProjects = async () => {
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
                let cp = projects.filter((project: any) => project.status === "Completed");
                let ip = projects.filter((project: any) => project.status === "In Progress");
                setCompletedProjects(cp);
                setInProgressProjects(ip);
            } catch (error) {
                console.error("Fetch Projects Error:", error);
            }
        };
        fetchUserProjects();
        setTimeout(() => setLoading(false), 200);
    }, [username,navigate]);
    // console.log("following",isFollowing)
    const handleFollow = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            await axios.post(`http://localhost:8000/api/v1/client/follow/${username}`, {
                username: username,
                followerRole: localStorage.getItem("role"),
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setIsFollowing(true);
            socket?.emit("notification", {
                accessToken: accessToken,
                notification: {
                    message: `@${loggedUsername} has started following you!`,
                    type: "following",
                    sender: localStorage.getItem("username"),
                    receiver: username,
                    senderRole: localStorage.getItem("role"),
                    receiverRole: "client",
                    markedAsRead: false
                }
            });
            // console.log("Follow Response:", response.data);
        } catch (error) {
            console.error("Follow Error:", error);
        }
    };

    const handleUnFollow = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            // console.log(")
            await axios.post(`http://localhost:8000/api/v1/client/unfollow/${username}`, {
                username: username,
                unFollowerRole: localStorage.getItem("role"),
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setIsFollowing(false);
            // setFollowers(followers-1);
            // console.log("UnFollow Response:", response.data);
        } catch (error) {
            console.error("UnFollow Error:", error);
        }
    }

    const sendConnectionRequest = async () => {
        
        try {
            socket?.emit("notification", {
                // username: username,
                accessToken: accessToken,
                notification: {
                    message: `You have a new connection request from @${loggedUsername}`,
                    type: "connection_request",
                    sender: localStorage.getItem("username"),
                    receiver: username,
                    senderRole: localStorage.getItem("role"),
                    receiverRole: "client",
                    markedAsRead: false
                }
            });
            setConnectionRequest(true);
            setIsConnected(false);
        } catch (error) {
            console.error("Connect Error:", error);
        }
    }

    const handleDisconnect = async () => {
        try {
            if(connectionRequest){
                socket?.emit("delete notification", {
                    accessToken: accessToken,
                    info:{
                            type: "connection_request",
                            receiver: username,
                            receiverRole: "client",
                            markedAsRead: false
                        }
                    
                });
                setConnectionRequest(false);
            }
            else if(window.confirm("Are you sure you want to disconnect?")){
                const accessToken = localStorage.getItem("accessToken");
                await axios.post(`http://localhost:8000/api/v1/client/disconnect/${username}`, {
                    username: username,
                    disConnectorRole: localStorage.getItem("role"),
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setIsConnected(false);
            }
        } catch (error) {
            console.error("Disconnect Error:", error);
        }
    }

    const messageUser = async () => {
        // console.log("entered newChat: ");
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/root/create_chat`, {
                users: [
                    {
                        username: loggedUsername,
                        userRole: loggedInRole
                    },
                    {
                        username: username,
                        userRole: userType
                    },
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            console.log("successfully created chat: ", response.data.data.chat);
            const fetchedMessages = await axios.get(`http://localhost:8000/api/v1/root/get_messages/${response.data.data.chat._id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log("successfully fetched messages for this chat: ", fetchedMessages.data.data.messages);
            navigate(`/${loggedInRole}/chats/${loggedUsername}?username=${username}&userRole=${userType}`)
        } catch (error) {
            console.error("Chat Error:", error);
        }
    }

    // const demo = async () => {
    //     try {
    //         const response = await axios.get("http://localhost:8000/api/v1/client/demo",{
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //             }
    //         });
    //         console.log("demo",response)
    //     } catch (error) {
    //         console.error("Fetch Projects Error:", error);
    //     }
    // }


    let notStarted=0;
    let inProgress=0;
    let onHold=0;
    let completed=0;
    let cancelled=0;
    let total=projects.length;
    projects.map((project: { status: string })=>{
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

    <div className="min-h-screen w-full bg-gray-300">
      {/* Header */}
      <Header/>
      <div className="lg:h-[18vh] sm:h-[10vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center lg:items-start px-8">
        <h1 className="text-3xl text-white font-bold lg:mt-6">Profile</h1>
      </div>
      {/* <Skeleton className="w-[100px] h-[20px] rounded-full" /> */}

      <div className="flex lg:flex-row flex-col justify-center md:items-center sm:items-center lg:mt-[-10vh] sm:gap-2 ">
        {/* Sidebar Profile Card */}
{!loading ? (
  <div className="w-full sm:w-[75%] md:w-[50%] lg:w-[25%] h-auto lg:h-[83vh] bg-slate-50 shadow-lg rounded-lg p-6 flex flex-col items-center border border-gray-200">
    {/* Profile Image */}
    <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center border border-gray-300">
      <img
        src={avatar || "/images/freelancer.png"}
        alt="Profile Avatar"
        className="w-full h-full rounded-full object-cover"
      />
    </div>
    
    {/* User Info */}
    <p className="text-xl font-semibold mt-4">{fullname}</p>
    <p className="text-gray-600">@{username}</p>
    <p className="text-gray-500 mt-2">Client</p>

    {/* Stats Section */}
    <div className="flex justify-center sm:justify-evenly w-full mt-4 text-center">
      <div>
        <p className="font-semibold text-gray-700">{connections}</p>
        <Link to={`/client/connections/${username}`} className="text-gray-500 text-sm">Connections</Link>
      </div>
      <div>
        <p className="font-semibold text-gray-700">{following}</p>
        <Link to={`/client/followings/${username}`} className="text-gray-500 text-sm">Followings</Link>
      </div>
      <div>
        <p className="font-semibold text-gray-700">{followers}</p>
        <Link to={`/client/followers/${username}`} className="text-gray-500 text-sm">Followers</Link>
      </div>
    </div>

    {/* Action Buttons */}
    {loggedUsername && username !== loggedUsername && (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <button className={connectionRequest ? "bg-gray-200 text-blue-950 px-4 py-2 rounded-lg shadow-md" : isConnected ? "bg-gray-200 text-blue-950 px-4 py-2 rounded-lg shadow-md" : "bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"} onClick={() => {connectionRequest ? handleDisconnect() : isConnected ? handleDisconnect() : sendConnectionRequest()}}>
          {connectionRequest ? "Request Sent" : isConnected ? "Connected" : "Connect"}
        </button>
        <button className={isFollowing ? "bg-gray-200 text-blue-950 px-4 py-2 rounded-lg shadow-md" :"bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"} onClick={() =>{isFollowing ? handleUnFollow() : handleFollow()}}>
          {isFollowing ? "Followed" : "Follow"}
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition" onClick={messageUser}>
          Message
        </button>
      </div>
    )}

    {/* About & Experience Sections */}
    <div className="w-full mt-3">
      <h3 className="font-semibold text-gray-800">About</h3>
      <textarea
        readOnly
        value={about}
        className="w-full mt-2 p-3 text-sm bg-gray-200 border border-gray-200 rounded-md resize-none outline-none h-24"
      ></textarea>
    </div>

    <div className="w-full mt-3">
      <h3 className="font-semibold text-gray-800">Experience</h3>
      <textarea
        readOnly
        value={experience}
        className="w-full mt-2 p-3 text-sm bg-gray-200 border border-gray-200 rounded-md resize-none outline-none h-24"
      ></textarea>
    </div>

    {/* Edit Profile Button */}
    {loggedUsername && username === loggedUsername && (
      <Link
        to={`/${userType}/edit/${username}`}
        className="mt-3 bg-blue-500 text-white text-center px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Edit Profile
      </Link>
    )}
  </div>
) : (
  // Skeleton Loader
  <div className="w-full sm:w-[75%] md:w-[50%] lg:w-[25%] h-auto lg:h-[83vh] bg-slate-50 shadow-lg rounded-lg p-6 flex flex-col items-center border border-gray-200">
    <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center border border-gray-300">
      <Skeleton className="w-full h-full rounded-full" />
    </div>
    <Skeleton className="w-3/5 h-6 mt-4" />
    <Skeleton className="w-2/5 h-4 mt-2" />
    <Skeleton className="w-1/4 h-4 mt-2" />
    <div className="flex justify-evenly w-full mt-4 text-center">
      <div className="flex flex-col items-center">
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-16 h-4 mt-1" />
      </div>
      <div className="flex flex-col items-center">
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-16 h-4 mt-1" />
      </div>
      <div className="flex flex-col items-center">
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-16 h-4 mt-1" />
      </div>
    </div>
    <div className="flex justify-evenly w-full mt-4">
      <Skeleton className="w-24 h-10 rounded-lg" />
      <Skeleton className="w-24 h-10 rounded-lg" />
    </div>
    <div className="w-full mt-6">
      <Skeleton className="w-1/3 h-5" />
      <Skeleton className="w-full h-20 mt-2" />
    </div>
    <div className="w-full mt-6">
      <Skeleton className="w-1/3 h-5" />
      <Skeleton className="w-full h-20 mt-2" />
    </div>
    <Skeleton className="w-32 h-10 mt-6 rounded-lg" />
  </div>
)}


        {/* Main Content Area */}
        {!loading ? (
        <div className="w-full sm:w-[90%] md:w-[75%] lg:w-[65%] h-auto lg:h-[83vh] bg-slate-50 shadow-lg rounded-lg p-6 sm:p-8 border border-gray-200 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Projects Status</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">Completed: {completed}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">In Progress: {inProgress}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">Not Started: {notStarted}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">On Hold: {onHold}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">Cancelled: {cancelled}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">Total: {total}</h3>
            </div>
          </div>

          {/* In Progress Projects */}
          <h2 className="text-xl font-semibold mb-3 text-black"> Projects In Progress</h2>
        <div className="mb-8 overflow-auto bg-gray-200 px-4 py-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressProjects.length > 0 ? (
                inProgressProjects.map((project: { _id: string; title: string; description: string; industry: string }) => (
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
                                    {(project.description.length > 5 ? project.description.slice(0,5)+"..." : project.description)|| "No description provided."}
                                </p>
                            </div>
                            <div>
                                <button
                                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition mr-1"
                                    onClick={() => navigate(`/${userType}/view_project/${username}/${project._id}`)}
                                    >
                                    View Project
                                </button>
                            </div>
                        </div>
                        { loggedUsername && username === loggedUsername ? (    
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
                <div className="col-span-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">No completed projects available</p>
                </div>
                )}
            </div>
        </div>


          {/* Completed Projects */}
          <h2 className="text-xl font-semibold mb-3 text-blue-700">Completed Projects</h2>
        <div className="mb-8 overflow-auto bg-gray-200 px-4 py-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedProjects.length > 0 ? (
                completedProjects.map((project: { _id: string; title: string; description: string; industry: string }) => (
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
                                    {(project.description.length > 10 ? project.description.slice(0,10)+"..." : project.description) || "No description provided."}
                                </p>
                            </div>
                            <div>
                                <button
                                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition mr-1"
                                    onClick={() => navigate(`/${userType}/view_project/${username}/${project._id}`)}
                                    >
                                    View Project
                                </button>
                            </div>
                        </div>
                        {/* <p className="text-sm text-gray-600 mt-1 truncate">
                            {project.status || "No status provided."}
                        </p> */}
                        { loggedUsername && username === loggedUsername ? (    
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
                <div className="col-span-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">No completed projects available</p>
                </div>
                )}
            </div>
        </div>
        { loggedUsername && loggedUsername !== username ? 
            (<div className="w-full flex justify-center items-center">
                <button
                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition w-1/6"
                    onClick={() => navigate(`/client/my_projects/${username}`)}
                    >
                    View All Projects
                </button>
            </div>)
            : null
        }
      </div>)
      :(
        <div className="w-[65%] h-[83vh] bg-slate-50 shadow-lg rounded-lg p-8 ml-6 border border-gray-200 flex flex-col gap-4 overflow-auto">
            <div className="grid grid-cols-3 gap-4 mb-8">
            {Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
                <Skeleton className="w-3/5 h-6" />
                </div>
            ))}
            </div>
            <div className="mb-3">
                <Skeleton className="w-1/3 h-8 bg-gray-300 rounded-md" />
            </div>
            <div className="mb-8 bg-gray-100 px-4 py-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, index) => (
                <div
                    key={index}
                    className="bg-slate-50 border border-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition flex flex-col gap-3"
                >
                    <div className="flex justify-between items-start">
                    <div className="w-3/4">
                        <Skeleton className="w-full h-6 mb-2" />
                        <Skeleton className="w-4/5 h-4" />
                    </div>
                    <Skeleton className="w-24 h-8" />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                    <Skeleton className="w-1/4 h-5" />
                    <Skeleton className="w-2/4 h-8" />
                    </div>
                </div>
                ))}
            </div>
            </div>


            <div className="mb-3">
                <Skeleton className="w-1/3 h-8 bg-gray-300 rounded-md" />
            </div>
            <div className="mb-8 bg-gray-100 px-4 py-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, index) => (
                <div
                    key={index}
                    className="bg-slate-50 border border-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition flex flex-col gap-3"
                >
                    <div className="flex justify-between items-start">
                    <div className="w-3/4">
                        <Skeleton className="w-full h-6 mb-2" />
                        <Skeleton className="w-4/5 h-4" />
                    </div>
                    <Skeleton className="w-24 h-8" />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                    <Skeleton className="w-1/4 h-5" />
                    <Skeleton className="w-2/4 h-8" />
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
      )
}
    </div>
    </div>
  )
}
export default ClientProfile