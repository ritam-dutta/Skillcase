import "./App.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./components/header";
// import Loader from "./components/loader";
import { CheckCircle } from "lucide-react";
import { useSocket } from "./context/socket.context";
import { useNotification } from "./context/notifications.context";

interface Notification {
    message: string;
    markAsRead: boolean;
    sender: string;
    receiver: string;
    type: string;
    senderRole: string;
}
interface Notifications {}
const Notifications: React.FC<Notifications> = ({}) => {
    const [loading, setLoading] = useState(false);
    const socket = useSocket();
    const { notifications, setNotifications} = useNotification();
    const {setUnreadNotifications} = useNotification();
    const {username} = useParams<{ username: string }>();
    const role = window.location.href.includes("client") ? "client" : "freelancer";
    // const [messages, setMessages] = useState([]);
    // const [markAsReads, setMarkAsReads] = useState(false);
    // const [senders, setSenders] = useState([]);
    // const [receivers, setReceivers] = useState([]);
    // const [types, setTypes] = useState([]);
    // const [isConnected, setIsConnected] = useState(false);
    // const [isRejected, setIsRejected] = useState(false);
    const navigate = useNavigate();
    // const currentRole = window.location.href.includes("client") ? "client" : "freelancer";
    const loggedRole = localStorage.getItem("role");
    const loggedUsername = localStorage.getItem("username");
    const accessToken = localStorage.getItem("accessToken");


    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            loggedUsername !== username ? navigate(`/${role}/profile/${username}`) : null;
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/${loggedRole}/get_notifications/${loggedUsername}`,{
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        // role: loggedRole,
                    }
                });
                const fetchedNotifications = response.data.data.notifications;
                console.log(fetchedNotifications)
                setNotifications(fetchedNotifications.filter((notif : Notification) => notif.type !== "apply for project" && notif.type !== "collaborate on project"));
                setUnreadNotifications(fetchedNotifications.filter((notif : Notification) => !notif.markAsRead));
                // let message: string[] = fetchedNotifications.map((notif: Notification) => notif.message);
                // let markAsRead: boolean[] = fetchedNotifications.map((notif: Notification) => notif.markAsRead);
                // let sender: string[] = fetchedNotifications.map((notif: Notification) => notif.sender);
                // let receiver = fetchedNotifications.map((notif: Notification) => notif.receiver);
                // let type = fetchedNotifications.map((notif: Notification) => notif.type);
                // setMessages(message);
                // setMarkAsReads(markAsRead);
                // setSenders(sender);
                // setReceivers(receiver);
                // setTypes(type);
            } catch (error) {
                console.error("Fetch Notifications Error:", error);
            }
            setLoading(false);
        };
        fetchNotifications();
    }, [loggedUsername, navigate]);
    // console.log("notifications",notifications)
    
    const handleConnect = (username:String, role:string) => {
        
        try {
            setNotifications(notifications.filter((notif) => notif.sender !== username || notif.type !== "connection_request"));
            socket?.emit("accept connection", {
                accessToken: accessToken,
                info:{
                    sender: username,
                    receiver: loggedUsername,
                    senderRole: role,
                    receiverRole: loggedRole,
                }
            });
    
        } catch (error) {
            console.error("Connect Error:", error);
        }
    }

    const handleReject = ( username:string, type:string) => {
        try {
            setNotifications(notifications.filter((notif) => notif.sender !== username  || notif.type !== type));
            // console.log(username,type)
            socket?.emit("reject connection", {
                accessToken: accessToken,
                info:{
                    receiver: loggedUsername,
                    sender: username,
                    receiverRole: loggedRole,
                }
            });
            // console.log("Disconnect Response:", response.data);
        } catch (error) {
            console.error("Delete notification Error:", error);
        }
    }
    
    const deleteNotification = (username: string, type: string) => {
        try {
            setNotifications(notifications.filter((notif) => notif.sender !== username || notif.type !== type));
            socket?.emit("delete notification", {
                accessToken: accessToken,
                info:{
                    receiver: loggedUsername,
                    receiverRole: loggedRole,
                    sender: username,
                    type: type,
                }
            });
        } catch (error) {
            console.error("Delete notification Error:", error);
        }
    }

    const deleteAllNotifications = () => {
        try {
            setNotifications([]);
            socket?.emit("delete all notifications", {
                accessToken: accessToken,
                info:{
                    user: loggedUsername,
                    userRole: loggedRole,
                }
            });
        } catch (error) {
            console.error("Delete all notifications Error:", error);
        }
    }
      
    return (
        <div className="min-h-screen w-full bg-gray-300 dark:bg-gray-600">
  <Header />

  {/* Top Bar */}
  <div className="h-[14vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-800 dark:to-slate-900 flex items-start px-6 sm:px-8">
    <h2 className="text-2xl sm:text-3xl text-white dark:text-gray-100 font-bold mb-4 flex items-center mt-6">
      Notifications
    </h2>
  </div>

  {/* Notification Container */}
  <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-slate-900 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700 lg:mt-[-8vh] md:mt-4 sm:mt-4">
    <div className="flex items-center justify-between">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">New notifications</h1>
      {notifications.length > 0 ? (
        <button className="flex text-green-500 hover:text-green-700" onClick={deleteAllNotifications}>
          <CheckCircle size={20} />
          <p className="ml-1">All</p>
        </button>
      ) : null}
    </div>

    {/* Notification States */}
    {loading ? (
      <p className="text-gray-600 dark:text-gray-300">Loading notifications...</p>
    ) : notifications.length === 0 ? (
      <p className="text-gray-600 dark:text-gray-300">No new notifications</p>
    ) : (
      <div className="space-y-4">
        {notifications.map((notif, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-3 py-2 rounded-lg border shadow-sm mt-2
              ${ "bg-blue-100 dark:bg-slate-800 border-blue-300 dark:border-slate-600"}`}
          >
            {/* Left Side */}
            <div className="flex gap-4">
              <Link to={`/${notif.senderRole}/profile/${notif.sender}`}>
                <div className="flex justify-center items-center rounded-full h-6 w-6 bg-gray-400 dark:bg-gray-600">
                  <img src="/images/user.png" alt="User" className="h-4 w-4" />
                </div>
              </Link>
              <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100">
                {notif.message}
              </p>
            </div>

            {/* Right Side Buttons */}
            <div className="flex space-x-3">
              {(notif.type === "connection_request") && !notif.markAsRead ? (
                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => { handleConnect(notif.sender, notif.senderRole) }}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 transition w-full sm:w-auto"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => { handleReject(notif.sender, notif.type) }}
                    className="bg-gray-200 dark:bg-gray-600 text-blue-950 dark:text-white px-3 py-1 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-500 transition w-full sm:w-auto"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => { deleteNotification(notif.sender, notif.type) }}
                    className="text-green-500 hover:text-green-700"
                  >
                    <CheckCircle size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

    
    )
}

export default Notifications;