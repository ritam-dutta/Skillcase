import { Link, useParams } from "react-router-dom";
import "../App.css";
import { Bell,User, Home, Upload , UserCheck, File, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "../context/socket.context";
import { useNotification } from "../context/notifications.context";

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

  const socket = useSocket();
  const {notifications, setNotifications} = useNotification();

  useEffect(() => {
    socket?.emit("joinNotification", loggedUsername);

  },[socket])

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/${loggedRole}/get_notifications/${loggedUsername}`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    // role: loggedRole,
                }
            });
            const fetchedNotifications = response.data.data.notifications;
            // console.log(fetchNotifications)
            setNotifications(fetchedNotifications.filter((notif : Notification) => notif.type !== "apply for project" && notif.type !== "collaborate on project"));
          
        } catch (error) {
            console.error("Fetch Notifications Error:", error);
        }
    };
    fetchNotifications();
}, [loggedUsername]);


  let activeTab = "";
    if(url.includes("/projects")){
      activeTab="projects"
    }
    else if(url.includes("/profile")){
      activeTab="profile"
    }
    else if(url.includes("/upload")){
      activeTab="upload"
    }
    else if(url.includes("/contact")){
      activeTab="contact"
    }
    else if(url.includes("/notifications")){
      activeTab="notifications"
    }
    else if(url.includes("/my_requests")){
      activeTab="requests"
    }
    else{
      activeTab="home"
    }
    
    // console.log("unreadNotifications",unreadNotifications);
    console.log("notifications",notifications);

  return (
    <header className="h-[8vh] w-full bg-gradient-to-r from-gray-50 to-gray-200 text-white shadow-md">
      <div className="container mx-auto h-full px-6 flex justify-between items-center">
        <div className="flex items-center">

          <Link to="/" className="text-2xl font-bold text-gray-600">
            SkillCase
          </Link>
        </div>

        <nav className="flex justify-between items-center gap-10">
          <Link
            to="/"
            className="text-lg font-medium hover:text-gray-400 transition text-gray-600"
          >
            <Home/>
          </Link>
          {loggedUsername === username ?  (
          <Link 
            to={`/${role}/projects/${username}`}
            className={`text-lg font-medium hover:text-gray-400 transition  ${activeTab==="projects" ? "text-gray-400" : "text-gray-600"}`}
          >
            <File/>
          </Link>)
          : null
          }
          {role==="freelancer" ? null :(
          <Link 
            to={`/client/upload_project/${username}`}
            className={`text-lg font-medium hover:text-gray-400 transition  ${activeTab==="upload" ? "text-gray-400" : "text-gray-600"}`}
          >
            <Upload/>
          </Link>
          )}
          <Link
            to={`/${role}/profile/${username}`}
            className={`text-lg font-medium hover:text-gray-400 transition  ${activeTab==="profile" ? "text-gray-400" : "text-gray-600"}`}
          >
            <User/>
          </Link>
          {
            loggedRole === "freelancer" && loggedUsername === username ? (
            <Link
              to={`/freelancer/my_requests/${username}`}
              className={`text-lg font-medium hover:text-gray-400 transition  ${activeTab==="requests" ? "text-gray-400" : "text-gray-600"}`}
            >
              <div>
                <Zap />
              </div>
            </Link>
            ) : null
          }
          {
            loggedRole === "client" && loggedUsername === username ? (
              <Link
                to={`/client/requests/${username}`}
                className={`text-lg font-medium hover:text-gray-400 transition  ${activeTab==="requests" ? "text-gray-400" : "text-gray-600"}`}
              >
                <div>
                  <Zap />
                </div>
              </Link>
              ) : null
          }
          {
            loggedUsername === username ? (
            <Link
              to={`/${role}/notifications/${username}`}
              className={`text-lg font-medium hover:text-gray-400 transition  ${activeTab==="notifications" ? "text-gray-400" : "text-gray-600"}`}
            >
              <Bell className=" mt-4"/>
            <div className="rounded-full bg-red-600 h-4 w-4 -translate-y-7 translate-x-3 text-white flex justify-center items-center text-xs">{notifications.length < 10 ? notifications.length : "9+"} </div>
            </Link>
            ) : null
          }
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
