import { useEffect, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { useSocket } from "./context/socket.context";
import Header from "./components/header";
import axios from "axios";

interface Chat {
    _id: string;
    users: Object;
    lastMessage?: string;
}
const Chats: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [currentChat, setCurrentChat] = useState<Chat>({_id: '', users: {}});
    // const [newReceivedMessage, setNewReceivedMessage] = useState(null);
    // const [newSentMessage, setNewSentMessage] = useState(null);
    const [message, setMessage] = useState("");
    const [chatId, setChatId] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const loggedUsername = localStorage.getItem('username');
    const loggedRole = localStorage.getItem('role') || "";
    const accessToken = localStorage.getItem('accessToken');

    const socket = useSocket();

    useEffect(() => {
        if(chatId !== "") {
            console.log("chatId: ", chatId);
            socket?.emit("joinChat", chatId);
        }
    }, [socket, chatId]);

    useEffect(() => {
        socket?.on("new message", (data: any) => {
            console.log("messages agaye")
            const {info} = data;
            console.log("info: ", info);
            if(info?.sender?.username !== loggedUsername) {
                console.log("New Message: ", info);
                // setNewReceivedMessage(info.message);
                setMessages((prevMessages) => [...prevMessages, info]);
            }
            else{
                // setNewSentMessage(info.message);
                setMessages((prevMessages) => [...prevMessages, info]);
            }
            console.log("messages", messages);
        });
    }, [socket]);
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
        console.log("entered newChat: ");
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/root/create_chat`, {
                users: [
                    {
                        username: loggedUsername,
                        userRole: loggedRole
                    },
                    {
                        username: recipent.username,
                        userRole: recipent.role
                    },
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setCurrentChat(response.data.data.chat);
            setChatId(response.data.data.chat._id);
            console.log("successfully created chat: ", response.data.data.chat);
            const fetchedMessages = await axios.get(`http://localhost:8000/api/v1/root/get_messages/${response.data.data.chat._id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setMessages(fetchedMessages.data.data.messages);
            console.log("successfully fetched messages for this chat: ", fetchedMessages.data.data.messages);
        } catch (error) {
            console.error("Chat Error:", error);
        }
    }

    const sendNewMessage = () => {
        console.log("entered sendNewMessage ");
        try {
        //     const response = await axios.post(`http://localhost:8000/api/v1/root/create_message`, {
        //         chatId: chatId,
        //         message: message,
        //         sender: {
        //             username: loggedUsername,
        //             userRole: loggedRole
        //         }
        //     },
        // {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // });
            socket?.emit("new message", 
                {
                    accessToken: accessToken,
                    info: {
                        chatId: currentChat._id,
                        message: message,
                        sender: {
                            username: loggedUsername,
                            userRole: loggedRole
                        }
                    }
        
                }, 
            );
            console.log("successfully sent message: ", message);
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
                    <div className="w-2/6 bg-slate-50 rounded-tl-lg rounded-bl-lg">
                        {/* <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Chats</h1>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">New Chat</button>
                        </div> */}
                        <div className="mt-4">
                        {/* <div className="bg-gray-300 h-[0.5px] mt-2"></div> */}

                            {followers.map((follower: any, index) => (
                            <div key={index} className="w-full flex-col hover:bg-[#F0F0F0]" onClick={() => newChat(follower)}>
                                <div className="flex items-center space-x-4 p-2">
                                    <div className="p-1">
                                        <div className="h-11 w-11 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center">
                                            <img src="/images/user.png" alt="avatar" className="h-6 w-6 object-cover" />
                                        </div>
                                    </div>
                                    <div className=" w-full">
                                        <div className=" w-full" >
                                            <h1 className="text-lg font-bold">{follower.username}</h1>
                                            <p className="text-sm text-gray-500">{currentChat.lastMessage}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex justify-end">
                                    <div className="bg-[#F0F0F0] h-[0.5px] w-[85%] "></div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-4/6 bg-gray-200 rounded-tr-lg rounded-br-lg">
                        <div className="bg-[#F0F0F0] h-[10%]" tabIndex={-1}>
                            
                        </div>
                        <div className={`bg-[#EAE6DF] h-[80%] overflow-auto p-2`} tabIndex={-1}>
                            {messages.map((message: any, index) => (
                                message?.sender?.username === loggedUsername ? (
                                    <div key={index} className="flex justify-end m-3">
                                        <div className="bg-blue-500 text-white px-3 py-2 rounded-lg max-w-xl break-words overflow-hidden">
                                            {message.message}
                                        </div>
                                    </div>

                                ) : (
                                    <div key={index} className="flex justify-start m-3">
                                        <div className="bg-gray-300 text-black px-3 py-2 rounded-lg max-w-xl break-words overflow-hidden">{message.message}</div>
                                    </div>
                                )
                            ))     
                            }
                        </div>
                        <div className={`w-full h-[10%]  flex justify-center items-center bg-[#F0F0F0] space-x-2`}>
                            <textarea
                                placeholder="Type a message"
                                className="w-[80%] h-[70%] rounded-md outline-none resize-none px-3 py-2 "
                                onChange={(e) => setMessage(e.target.value)}               
                            />
                            <SendHorizonal size={24} className="text-[#5a5858] cursor-pointer" onClick={sendNewMessage} />
                        </div>


                    </div>
                </div>
            </div>
        </div>
        </>

    )
}

export default Chats;