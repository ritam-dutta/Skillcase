import React,{ useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./components/header";
import Loader from "./components/loader";
// import Footer from "./components/footer";
import axios from "axios";
import "./App.css"
import { useSocket } from "./context/socket.context";
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

    const socket = useSocket();

    const[fullname,setFullname]=useState("");
    const[following, setFollowing]=useState(0);
    const[followers, setFollowers]=useState(0);
    const [connections, setConnections] = useState(0);
    const[about,setAbout]=useState("");
    const [skills, setSkills] = useState([""]);
    const [avatar, setAvatar] = useState("");
    const[currentRole,setRole]=useState(userType);
    const {username} = useParams<{ username: string }>();
    const [loggedUsername, setLoggedUsername] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [connectionRequest, setConnectionRequest] = useState(false);
    
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
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
                let loggedInUser : any;
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
                localStorage.setItem("username",loggedInUser.username);
                // console.log("currentUser",currentUser)
                // console.log("loggedInUser",loggedInUser)
                if(loggedInUser.username === currentUser.username){
                    fetchedUser = loggedInUser;
                }
                else{
                    fetchedUser = currentUser;
                    if(fetchedUser.followers.some((follower: { username: string }) => follower.username === loggedInUser.username)){
                      setIsFollowing(true);
                  }
                  if(fetchedUser.connections.some((connection: { username: string }) => connection.username === loggedInUser.username)){
                      setIsConnected(true);
                  }
                }
                // localStorage.setItem("username",fetchedUser.username);
                // console.log(fetchedUser)
              
                setUser(fetchedUser);
                setFullname(fetchedUser?.fullname || "");
                setFollowing(fetchedUser?.following.length || 0);
                setFollowers(fetchedUser?.followers.length || 0);
                setConnections(fetchedUser?.connections.length || 0);
                setAbout(fetchedUser?.about || "")  
                setSkills(fetchedUser?.skills || [""]) 
                setAvatar(fetchedUser?.avatar || "/images/freelancer.png") 
                setRole(fetchedUser?.role || "")
            } catch (error) {
                console.error("error fetching user data",error);
                navigate(`/${currentRole}/login`);
            }
            setLoading(false);
        };
        fetchUserData();
    }, [username,navigate]);

    const handleFollow = async () => {
      try {
          const response = await axios.post(`http://localhost:8000/api/v1/freelancer/follow/${username}`, {
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
                receiverRole: "freelancer",
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
          // console.log(")
          const response = await axios.post(`http://localhost:8000/api/v1/freelancer/unfollow/${username}`, {
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
            accessToken: accessToken,
            notification: {
                message: `You have a new connection request from @${loggedUsername}`,
                type: "connection_request",
                sender: localStorage.getItem("username"),
                receiver: username,
                senderRole: localStorage.getItem("role"),
                receiverRole: "freelancer",
                markedAsRead: false
              }
            });
          // const accessToken = localStorage.getItem("accessToken");

          // const response = await axios.post(`http://localhost:8000/api/v1/freelancer/send_notification/${username}`, {
          //     // username: username,
          //     // receiverRole: "freelancer",
          //     notification:{
          //       message: `You have a new connection request from @${loggedUsername}`,
          //       type: "connection_request",
          //       sender: localStorage.getItem("username"),
          //       receiver: username,
          //       senderRole: localStorage.getItem("role"),
          //       receiverRole: "freelancer",
          //       markedAsRead: false,
          //     }, 

          // }, {
          //     headers: {
          //         Authorization: `Bearer ${accessToken}`,
          //     },
          // });
          setConnectionRequest(true);
          setIsConnected(false);
      } catch (error) {
          console.error("Connect Error:", error);
      }
  }

  const handleConnect = async () => {
      try {
          const response = await axios.post(`http://localhost:8000/api/v1/freelancer/connect/${username}`, {
              username: username,
              connectorRole: localStorage.getItem("role"),
          }, {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          });
          setIsConnected(true);
          // setConnections(connections+1);
          // console.log("Connect Response:", response.data);
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
                          receiverRole: "freelancer",
                          markedAsRead: false
                      }
                  
              });
              setConnectionRequest(false);
          }
          else if(window.confirm("Are you sure you want to disconnect?")){
          const response = await axios.post(`http://localhost:8000/api/v1/freelancer/disconnect/${username}`, {
              username: username,
              disConnectorRole: localStorage.getItem("role"),
          }, {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          });
          setIsConnected(false);
          // setConnections(connections-1);
        }
          // console.log("Disconnect Response:", response.data);
      } catch (error) {
          console.error("Disconnect Error:", error);
      }
  }

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
          <p className="text-gray-500 mt-2">Freelancer</p>

            <div className="flex flex-col justify-evenly w-full mt-4 text-center">
                <div className="flex justify-evenly">
                    <div>
                    <p className="font-semibold text-gray-700">{connections}</p>
                    <Link to={`/freelancer/connections/${username}`} className="text-gray-500 text-sm">Connections</Link>
                    </div>
                    <div>
                    <p className="font-semibold text-gray-700">{following}</p>
                    <Link to={`/freelancer/followings/${username}`} className="text-gray-500 text-sm">Followings</Link>
                    </div>
                    <div>
                    <p className="font-semibold text-gray-700">{followers}</p>
                    <Link to={`/freelancer/followers/${username}`} className="text-gray-500 text-sm">Followers</Link>
                    </div>
                </div>
                
                {username === loggedUsername ? null : (
                <div className="flex justify-evenly">
                    <div>
                    {/* <button className={isConnected ? "mt-6 bg-gray-200 text-blue-950 text-center px-4 py-2 rounded-lg shadow-md" : "mt-6 bg-blue-500 text-white text-center px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition" } onClick={() => {isConnected ? handleDisconnect() : handleConnect()}}>{isConnected ? "Connected" : "Connect"}</button> */}
                    <button className={connectionRequest ? "mt-6 bg-gray-200 text-blue-950 text-center px-4 py-2 rounded-lg shadow-md" : isConnected ? "mt-6 bg-gray-200 text-blue-950 text-center px-4 py-2 rounded-lg shadow-md" : "mt-6 bg-blue-500 text-white text-center px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition" } onClick={() => {connectionRequest ? handleDisconnect() : isConnected ? handleDisconnect() : sendConnectionRequest()}}>
                      {connectionRequest ? "Request Sent" : isConnected ? "Connected" : "Connect"}
                    </button>
                    </div>
                    <div>
                    <button className={isFollowing ? "mt-6 bg-gray-200 text-blue-950 text-center px-4 py-2 rounded-lg shadow-md" :"mt-6 bg-blue-500 text-white text-center px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"} onClick={() =>{isFollowing ? handleUnFollow() : handleFollow()}}>{isFollowing ? "Followed" : "Follow"}</button>
                    </div>
                </div>
                )}
                
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
      </div>)
      : (
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
export default FreelancerProfile