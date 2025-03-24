import { useEffect, useState } from "react";
import Header from "./components/header";
import axios from "axios";

const Chats: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [currentChat, setCurrentChat] = useState({});
    const loggedUsername = localStorage.getItem('username');
    const loggedRole = localStorage.getItem('role') || "";
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const fetchedFollowers = await axios.get(`http://localhost:8000/api/v1/${loggedRole}/getfollowers/${loggedUsername}`);
                setFollowers(fetchedFollowers.data.data.followers);
            // console.log("follwers: ", response.data.data.followers);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    const newChat = async (recipent : any) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/root/create_chat`, {
                users: {
                    user1: {
                        username: loggedUsername,
                        role: loggedRole
                    },
                    user2: {
                        username: recipent.username,
                        role: recipent.role
                    },
                }
            },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

            setCurrentChat(response.data.data.chat);
        } catch (error) {
            console.error("Chat Error:", error);
        }
    }

    const newMessage = async (chatId : any, message : any) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/root/create_message`, {
                chatId: chatId,
                message: message,
                sender: {
                    username: loggedUsername,
                    role: loggedRole
                }
            },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
            
        } catch (error) {
            console.error("Message Error:", error);
        }
    }


    return (
        <>
        <div className="bg-[url('/images/background.jpg')] bg-cover bg-center min-h-screen">
            <Header />
            <div className="h-[15vh] w-full flex items-start px-8 bg-gradient-to-r from-blue-500 to-indigo-500">
                <h1 className="text-3xl text-white font-bold mt-6">Chats</h1>
            </div>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-7xl h-[80vh] bg-white rounded-lg shadow-lg mt-[-11vh] flex">
                    <div className="w-2/6 bg-slate-50 rounded-tl-lg rounded-bl-lg p-4">
                        {/* <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Chats</h1>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">New Chat</button>
                        </div> */}
                        <div className="mt-4">
                            {followers.map((follower: any) => (
                            <div className="flex items-center space-x-4 mt-2">
                                <div className="h-10 w-12 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center">
                                    <img src="/images/user.png" alt="avatar" className="h-6 w-6 object-cover" />
                                </div>
                                <div className=" w-full" onClick={ () => newChat(follower)}>
                                    <h1 className="text-lg font-bold">{follower.username}</h1>
                                    <p className="text-sm text-gray-500">Hello, how are you?</p>
                                    <div className="bg-gray-300 h-[0.5px] mt-2"></div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-4/6 bg-gray-200 rounded-tr-lg rounded-br-lg p-4 ">

                    </div>
                </div>
            </div>
        </div>
        </>

    )
}

export default Chats;