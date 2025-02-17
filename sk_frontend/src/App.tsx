// import axios from 'axios';
import { useEffect, useState } from 'react';
// import io from 'socket.io-client'
import { useNotification } from './context/notifications';
import { Outlet } from 'react-router-dom';
import { useSocket } from './context/socket';

interface App {}
const App: React.FC<App> = ({}) => {
    // const socket = io("http://localhost:8001");
    // const accessToken = localStorage.getItem("accessToken");
    // const loggedInRole = localStorage.getItem("role");
    // interface User {
    //     notifications?: any[];
    // }
    
    // const [user, setUser] = useState<User | null>(null);

    const socket = useSocket();
    const {notifications, setNotifications} = useNotification();

    useEffect(() => {
        socket?.on("notification", (notification : Notification) => {
            console.log("Notification Received", notification);
            setNotifications((prevNotifications) => [notification, ...prevNotifications]);
        });
    }, [socket]);

    // useEffect(() => {

    //     const fetchUser = async () => {
    //         if(!accessToken) return;
    //         if(!loggedInRole) return;

    //         const responseLoggedUser = await axios.get(`http://localhost:8000/api/v1/${loggedInRole}/loggedIn${loggedInRole[0].toUpperCase()}${loggedInRole.slice(1)}`, {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //             },
    //         });

    //         loggedInRole === "client" ? setUser(responseLoggedUser.data.data.client) : setUser(responseLoggedUser.data.data.freelancer);
    //     }
        
    //     fetchUser();
    // }, []);

    // const {unreadNotifications, setUnreadNotifications} = useNotification();

    // setUnreadNotifications(user?.notifications || []);

        


    return (
        <Outlet/>
    )
}

export default App