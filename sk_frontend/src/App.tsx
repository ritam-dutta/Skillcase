// import axios from 'axios';
import { useEffect, useState } from 'react';
// import io from 'socket.io-client'
import { useNotification } from './context/notifications.context';
import { Outlet } from 'react-router-dom';
import { useSocket } from './context/socket.context';

interface App {}
const App: React.FC<App> = ({}) => {
    // const socket = io("http://localhost:8001");
    // const accessToken = localStorage.getItem("accessToken");
    // const loggedInRole = localStorage.getItem("role");
    // interface User {
    //     notifications?: any[];
    // }
    
    // const [user, setUser] = useState<User | null>(null);

    interface Notification {
        message: string;
        markAsRead: boolean;
        sender: string;
        receiver: string;
        type: string;
        senderRole: string;
        id: string;
    }

    const socket = useSocket();
    const {notifications, setNotifications} = useNotification();
    const {requests, setRequests} = useNotification();
    // const {unreadNotifications, setUnreadNotifications} = useNotification();

    useEffect(() => {
        socket?.on("notification", (notification : Notification) => {
            console.log("Notification Received", notification);
            if(notification.type === "apply for project" || notification.type === "collaborate on project") {
                setRequests((prevRequests) => [...prevRequests,notification]);
            }
            else {
                setNotifications((prevNotifications) => [...prevNotifications, notification]);
            }
        });
        
    }, [socket]);
    // console.log("requests:", requests);

    return (
        <Outlet/>
    )
}

export default App