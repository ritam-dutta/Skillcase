import { Link, useParams } from "react-router-dom";
import "../App.css";
import { Bell,User, Home, Upload , File, FileText, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "../context/socket.context";
import { useNotification } from "../context/notifications.context";
import { useChat } from "../context/chats.context"; 

interface Header {}
interface Notification {
  message: string;
  markAsRead: boolean;
  sender: string;
  receiver: string;
  type: string;
  senderRole: string;
}

const Header: React.FC<Header> = ({}) => {

  const {username} = useParams<{ username: string }>();
  // const [notifications, setNotifications] = useState<Notification[]>([]);
  const url = window.location.href;
  const role = url.includes("freelancer") ? "freelancer" : "client";
  const loggedUsername = localStorage.getItem("username");
  const loggedRole = localStorage.getItem("role");
  const accessToken = localStorage.getItem("accessToken");
  const {requests}  = useNotification();
  const [requestsPresent, setRequestsPresent] = useState(requests.length > 0);
  const socket = useSocket();
  const {notifications, setNotifications} = useNotification();
  // const [isNewMessage, setIsNewMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const {unreadChats} = useChat();
  const [isNewMessage, setIsNewMessage] = useState(false);
  // const [requestsPresent, setRequestsPresent] = useState(false);
  
  useEffect(() => {
    socket?.emit("joinNotification", loggedUsername);
    
  },[socket])

  useEffect(() => {
    socket?.on("new message", () => {
      setIsNewMessage(true);
    });
  }, [socket]);
  
  
  useEffect(() => {
    // setRequestsPresent(requests.length > 0);
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/${loggedRole}/get_notifications/${loggedUsername}`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    // role: loggedRole,
                }
            });
            const response2 = await axios.get("http://localhost:8000/api/v1/root/getuserprojects",{
              headers: {
                  Authorization: `Bearer ${accessToken}`,
                  username: loggedUsername,
                  role: loggedRole
              }
          });
          let userProjects = response2.data.data;
          if (userProjects.some((project: any) => project.requests.length > 0)) {
            setRequestsPresent(true);
          }


          const fetchedNotifications = response.data.data.notifications;
          // console.log(fetchNotifications)
          setNotifications(fetchedNotifications.filter((notif : Notification) => notif.type !== "apply for project" && notif.type !== "collaborate on project")); 
        } catch (error) {
            console.error("Fetch Notifications Error:", error);
        }
    };
    fetchNotifications();
}, [loggedUsername]);


  useEffect(() => {
    let newActiveTab = "home";

    if (url.includes("/projects")) newActiveTab = "projects";
    else if (url.includes("/profile")) newActiveTab = "profile";
    else if (url.includes("/upload")) newActiveTab = "upload";
    else if (url.includes("/contact")) newActiveTab = "contact";
    else if (url.includes("/notifications")) newActiveTab = "notifications";
    else if (url.includes("/my_requests")) newActiveTab = "requests";
    else if (url.includes("/my_projects")) newActiveTab = "my_projects";
    else if (url.includes("/chats")) newActiveTab = "chats";

    setActiveTab(newActiveTab);
  }, [url]);

  useEffect(() => {
    if (activeTab === "chats") {
      setIsNewMessage(false);
    }
  }, [activeTab]);


  return (
    <header className="h-[8vh] w-full bg-gradient-to-r from-gray-50 to-gray-200 text-white shadow-md">
      <div className="container mx-auto h-full px-6 flex justify-between items-center">
        <div className="flex items-center">

          <Link to="/" className="text-2xl font-bold text-gray-600">
            SkillCase
          </Link>
        </div>

        <nav className="flex justify-between items-center gap-10">
          <div className="mt-1">
            <Link
              to="/"
              className="text-gray-600 flex flex-col items-center font-medium group transition "
            >
              <Home size={24} className="group-hover:text-gray-400 transition"/>
              <p className={`text-xs text-gray-600 font-medium group-hover:text-gray-400 transition`}>home</p>
            </Link>
          </div>

          <div className="mt-1">
            <Link 
              to={`/${role}/projects/${username}`}
              className={`font-medium flex flex-col items-center group transition  ${activeTab==="projects" ? "text-gray-400" : "text-gray-600"}`}
            >
              <File size={24} className="group-hover:text-gray-400 transition"/>
              <p className={`text-xs ${activeTab==="projects" ? "text-gray-400" : "text-gray-600"} font-medium group-hover:text-gray-400 transition `}>feed</p>
            </Link>
          </div>
          
          
          {role==="freelancer" ? null :(
            <div className="mt-1">
              <Link 
                to={`/client/upload_project/${username}`}
                className={`flex flex-col items-center font-medium hover:text-gray-400 group transition  ${activeTab==="upload" ? "text-gray-400" : "text-gray-600"}`}
              >
                <Upload size={24} className="group-hover:text-gray-400 transition"/>
              <p className={`text-xs ${activeTab==="upload" ? "text-gray-400" : "text-gray-600"} font-medium group-hover:text-gray-400 transition `}>upload </p>
              </Link>
            </div>
          )}
          <div className="mt-1">
            <Link
              to={`/${role}/profile/${username}`}
              className={`flex flex-col items-center font-medium hover:text-gray-400 group transition  ${activeTab==="profile" ? "text-gray-400" : "text-gray-600"}`}
            >
              <User size={24}/>
            <p className={`text-xs ${activeTab==="profile" ? "text-gray-400" : "text-gray-600"} font-medium group-hover:text-gray-400 transition`}>profile</p>
            </Link>
          </div>
          {
            (role === "freelancer" && loggedUsername === username) ? (
              <div className="mt-1">
                <Link
                  to={`/freelancer/my_requests/${username}`}
                  className={`flex flex-col items-center font-medium hover:text-gray-400 group transition  ${activeTab==="requests" ? "text-gray-400" : "text-gray-600"}`}
                >
                  <div>
                    <FileText size={24} className="group-hover:text-gray-400 transition"/>
                  </div>
                <p className={`text-xs ${activeTab==="requests" ? "text-gray-400" : "text-gray-600"} font-medium group-hover:text-gray-400 transition`}>applications</p>
                </Link>
              </div>
            ) : null
          }
          { (role === "client" && loggedUsername === username) ?
          <div className="mt-1 relative">
            <Link
              to={`/client/my_projects/${username}`}
              className={`flex flex-col items-center font-medium hover:text-gray-400 group transition  ${activeTab==="my_projects" ? "text-gray-400" : "text-gray-600"}`}
            >
            <div className="relative mt-1">
              <FileText size={24} className="group-hover:text-gray-400 transition"/>
              {(loggedUsername === username && (requests.length > 0 || requestsPresent)) ?  <div className="absolute rounded-full bg-red-600 h-2.5 w-2.5 -translate-y-6 translate-x-3 text-white flex justify-center items-center text-xs"></div>
              : null} 
            </div>
            <p className={`text-xs ${activeTab==="my_projects" ? "text-gray-400" : "text-gray-600"} font-medium group-hover:text-gray-400 transition`}>my projects</p>
            </Link>
          </div>
          : null
          }

          <div className="relative mt-1">
            <Link 
              to={`/${role}/chats/${username}`}
              className={`font-medium flex flex-col items-center group transition  ${activeTab==="chats" ? "text-gray-400" : "text-gray-600"}`}
            >
              <div className="relative mt-1">
              <MessageCircle size={24} className="group-hover:text-gray-400 transition"/>
              {isNewMessage || unreadChats.length > 0 ? <div className="absolute rounded-full bg-red-600 h-2.5 w-2.5 -translate-y-6 translate-x-3 text-white flex justify-center items-center text-xs"></div> : null}
              </div>
              <p className={`text-xs ${activeTab==="chats" ? "text-gray-400" : "text-gray-600"} font-medium group-hover:text-gray-400 transition `}>Chats</p>
            </Link>

          </div>

          <div className="mt-1 relative">
            <Link
              to={`/${role}/notifications/${username}`}
              className={`flex flex-col items-center font-medium hover:text-gray-400 group transition  ${activeTab==="notifications" ? "text-gray-400" : "text-gray-600"}`}
            >
            <div className="relative mt-1">
              <Bell size={24} className="group-hover:text-gray-400 transition"/>
              { loggedUsername === username ? <div className="absolute rounded-full bg-red-600 h-4 w-4 -translate-y-7 translate-x-3 text-white flex justify-center items-center text-xs">{notifications.length < 10 ? notifications.length : "9+"} </div>
              : null}
            </div>
            <p className={`text-xs ${activeTab==="notifications" ? "text-gray-400" : "text-gray-600"} font-medium group-hover:text-gray-400 transition`}>notifications</p>
            </Link>
          </div>
            
          {/* <Link
            to="/contact"
            className={`text-lg font-medium hover:text-gray-400 transition  ${activeTab==="contact" ? "text-gray-400" : "text-gray-600"}`}
          >
            <UserCheck/>
          </Link> */}
        </nav>

        {/* Mobile Menu Icon */}
        <div className=" flex items-center">
          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
