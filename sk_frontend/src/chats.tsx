import { useEffect, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { useSocket } from "./context/socket.context";
import { MessageCircle, Search, EllipsisVertical, CheckCheck } from "lucide-react";
import { Skeleton } from "./components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "./components/ui/dropdown-menu"
import Header from "./components/header";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useChat } from "./context/chats.context";

interface Chat {
    _id: string;
    lastMessage?: string;
    users: Array<{ username: string; userRole: string }>,
    unreadMessages?: Array<{ username: string; userRole: string; count: number }>,
    lastMessageSender?: string;
    lastMessageTime?: string;
}

const Chats: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [chatsLoading, setChatsLoading] = useState(false);
    const [chats, setChats] = useState<Chat[]>([]);
    const [allChats, setAllChats] = useState<Chat[]>([]);
    const [currentChat, setCurrentChat] = useState<Chat>({_id: '', users: []});
    // const [newSentMessage, setNewSentMessage] = useState(null);
    const [message, setMessage] = useState("");
    // const [chatId, setChatId] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const loggedUsername = localStorage.getItem('username');
    const loggedRole = localStorage.getItem('role') || "";
    const accessToken = localStorage.getItem('accessToken');
    const [searchParams] = useSearchParams();
    const messageUsername = searchParams.get("username");
    const messageUserRole = searchParams.get("userRole");
    const [isTyping, setIsTyping] = useState(false);

    const {setUnreadChats} = useChat();

    const socket = useSocket();

    useEffect(() => {
        if(chats.length > 0) {
            chats.forEach((chat: any) => {
                socket?.emit("joinChat", chat._id);
            })
        }

    }, [socket, chats]);

    useEffect(() => {
        socket?.on("new message", (data: any) => {
            // console.log("info: ", info);
            console.log("entered new message");
            const {message} = data;
           
            // console.log("updated chats", chats);
            
            if(message?.sender?.username !== loggedUsername) {
                if(message?.chatId === currentChat?._id) {
                    // console.log("chatId by chat : ", currentChat._id);
                    // console.log("chatId by info : ", info.chatId);
                    message.readBy.push({username: loggedUsername, userRole: loggedRole});
                    socket.emit("message read", {
                        info: message
                    });
                    axios.post(`http://localhost:8000/api/v1/root/mark_as_read`, {
                        messageId: message._id,
                        user:{
                            username: loggedUsername,
                            userRole: loggedRole
                        }
                    },
                    {
                        headers:{
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                    setMessages((prevMessages) => [...prevMessages, message]);
                    const chat = chats.find((chat: any) => chat._id === message.chatId);
                    if(chat) {
                        const unreadUser = chat.unreadMessages?.find((user: any) => user.username === loggedUsername && user.userRole === loggedRole);
                        if(unreadUser) {
                            unreadUser.count = 0;
                        } 
                        setChats((prevChats) => prevChats.map((c) => c._id === chat._id ? chat : c));
                        setAllChats((prevChats) => prevChats.map((c) => c._id === chat._id ? chat : c));
                    }
                }
                else{
                    const chat = chats.find((chat: any) => chat._id === message.chatId);
                    if(chat) {
                        const unreadUser = chat.unreadMessages?.find((user: any) => user.username === loggedUsername && user.userRole === loggedRole);
                        if(unreadUser) {
                            unreadUser.count += 1;
                            chat.lastMessageTime = message.createdAt;
                        } 
                        setChats((prevChats) => prevChats.map((c) => c._id === chat._id ? chat : c));
                        setAllChats((prevChats) => prevChats.map((c) => c._id === chat._id ? chat : c));
                    }
                    
                }
            }   
            console.log("exited if else")
            // socket.emit("all chats",{
            //     user: loggedUsername,
            //     allChats: chats,
            // })


            setChats((prevChats) => {
                const updatedChats = prevChats.map((chat) =>
                    chat._id === message.chatId
                        ? { ...chat, lastMessage: message.message, lastMessageSender: message.sender.username }
                        : chat
                );
            
                setAllChats(updatedChats); // ✅ Ensure allChats updates with latest chats
            
                // ✅ Move setUnreadChats inside to use updatedChats
                // setUnreadChats(updatedChats.filter((chat: any) =>
                //     chat.unreadMessages?.some((user: any) =>
                //         user.count !== 0 &&
                //         user.username === loggedUsername &&
                //         user.userRole === loggedRole
                //     )
                // ));

                console.log('working', updatedChats);
            
                return updatedChats;
            }); 
            console.log("second")                         
        });
        return () => {
            socket?.off("new message");
        }
    }, [socket, currentChat, chats]);

    useEffect(() => {
        socket?.on("message read", (info: any) => {
            if(info.chatId === currentChat._id) {
                // console.log("messages read: ", info);
                setMessages((prevMessages) => {
                    return prevMessages.map((message) => {
                        if(message._id === info.messageId) {
                            message.readBy = info.readBy;
                        }
                        return message;
                    })
                })
            }
        });
        
        return () => {
            socket?.off("message read");
        }
    }, [socket, currentChat, currentChat._id]);

    useEffect(() => {
        const fetchData = async () => {
            setChatsLoading(true);
            try{
                const fetchedChats = await axios.get(`http://localhost:8000/api/v1/root/get_chats/${loggedUsername}/${loggedRole}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setChats(fetchedChats.data.data.chats);
                setAllChats(fetchedChats.data.data.chats);
                console.log("fetched chats: ", fetchedChats.data.data.chats);
                // console.log("currentchat: ", currentChat);
                    
                

            } catch (error) {
                console.error(error);
            }
            setChatsLoading(false);
        }
        fetchData();
    }, []);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }    }, [messages]);

    useEffect(() => {
        socket?.on("read all", (messages) => {
            setMessages(messages);
        });
    
        return () => {
            socket?.off("read all");
        };
    }, [socket, currentChat, currentChat._id]);

    useEffect(() => {
        setUnreadChats(chats.filter((chat: any) =>
            chat.unreadMessages?.some((user: any) =>
                user.count !== 0 &&
                user.username === loggedUsername &&
                user.userRole === loggedRole
            )
        ));
    }, [chats]);


    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleTyping = () => {
        setIsTyping(true);
        socket?.emit("typing", { user: {
            username: loggedUsername,
            userRole: loggedRole
        } });
    
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
    
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          socket?.emit("stop typing", { user: {
            username: loggedUsername,
            userRole: loggedRole
          } }); 
        }, 2000);
      };

      useEffect(() => {
        socket?.on("userTyping", (data) => {
            if(data.user.username !== loggedUsername && data.user.userRole !== loggedRole) {
                setIsTyping(true);
            }
        });
        socket?.on("userStoppedTyping", (data) => {
            if(data.user.username !== loggedUsername && data.user.userRole !== loggedRole) {
                setIsTyping(false);
            }
        });
    
        return () => {
          socket?.off("userTyping");
          socket?.off("userStoppedTyping");
        };
      }, []);

    

    const messageUser = async (users: Array<{ username: string; userRole: string }>) => {
        // console.log("opening chat...")
        setLoading(true);
        const recipent = users[0].username !== loggedUsername ? users[0] : users[1];
       

        
        // console.log("entered messageUser: ");
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/root/create_chat`, {
                users: [
                    {
                        username: loggedUsername,
                        userRole: loggedRole
                    },
                    {
                        username: recipent.username,
                        userRole: recipent.userRole
                    },
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if(response.data.data.chat._id === currentChat?._id) {
                setLoading(false);
                return;
            }
            setCurrentChat(response.data.data.chat);

            const chat = chats.find((chat: any) => chat._id === response.data.data.chat._id);
            if(chat) {
                const unreadUser = chat.unreadMessages?.find((user: any) => user.username === loggedUsername && user.userRole === loggedRole);
                if(unreadUser) {
                    unreadUser.count = 0;
                } 
                setChats((prevChats) => prevChats.map((c) => c._id === chat._id ? chat : c));
                setAllChats((prevChats) => prevChats.map((c) => c._id === chat._id ? chat : c));
            }
            
            // setChatId(response.data.data.chat._id);
            // console.log("successfully created chat: ", response.data.data.chat);
            const fetchedMessages = await axios.get(`http://localhost:8000/api/v1/root/get_messages/${response.data.data.chat._id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            socket?.emit("read all", {
                accessToken: accessToken,
                chatId: response.data.data.chat._id,
                messages: fetchedMessages.data.data.messages.filter(
                    (message: any) =>
                      !message.readBy.some(
                        (reader: any) => reader.username === loggedUsername && reader.userRole === loggedRole
                      )
                  ),
                user: {
                    username: loggedUsername,
                    userRole: loggedRole
                }
            });
            setMessages(fetchedMessages.data.data.messages);  
            setLoading(false);
        } catch (error) {
            console.error("Chat Error:", error);
        }
    }

    useEffect(() => {
        if(messageUserRole && messageUsername){
            const users = [
                {
                    username: loggedUsername || "",
                    userRole: loggedRole
                },
                {
                    username: messageUsername,
                    userRole: messageUserRole
                }
            ]
            messageUser(users);
        }
    }, [messageUsername, messageUserRole]);

    const sendNewMessage = () => {
        setMessages([...messages, {message: message, sender: {username: loggedUsername, userRole: loggedRole}}]);
        // console.log("entered sendNewMessage ");
        try {
            socket?.emit("new message", 
                {
                    accessToken: accessToken,
                    info: {
                        chatId: currentChat._id,
                        message: message,
                        sender: {
                            username: loggedUsername,
                            userRole: loggedRole
                        },
                        readBy: [],
                    }
        
                }, 
            );
            chats.forEach((chat: any) => {
                if(chat._id === currentChat._id) {
                    chat.lastMessage = message;
                    chat.lastMessageSender = loggedUsername;
                }
            })
            setChats(chats);
            setAllChats(chats);
            // console.log("successfully sent message: ", message);
        } catch (error) {
            console.error("Message Error:", error);
        }
        setMessage("");
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
                    <div className="w-2/6 bg-slate-50 rounded-tl-lg rounded-bl-lg flex-col">
                        <div className="mt-4">
                            <div className="w-full flex justify-center items-center space-x-2">
                                <div className="w-[70%] flex">
                                    <div className="bg-slate-200 rounded-bl-lg rounded-tl-lg flex items-center justify-center pl-2">
                                        <Search size={18} className="text-[#5a5858] cursor-pointer" />
                                    </div>
                                    <input type="text" placeholder="Search for a user" className="w-full h-8 bg-slate-200 rounded-tr-lg rounded-br-lg outline-none px-3 py-2 font-sans" 
                                    onChange={(e) => {
                                        let filteredChats = allChats.filter((chat: any) =>chat.users[0].username!== loggedUsername ? chat.users[0].username.includes(e.target.value) : chat.users[1].username.includes(e.target.value));
                                        setChats(filteredChats);
                                        }
                                    }
                                    />
                                </div>
                                {/* <div className="w-[20%]">
                                    <button className="w-full h-8 bg-blue-500 text-white rounded-md font-sans">Search</button>
                                </div> */}
                            </div>
                        </div>
                        <div className="mt-4 px-2 overflow-auto">
                        {/* <div className="bg-gray-300 h-[0.5px] mt-2"></div> */}
                            {!chatsLoading ?
                            chats.map((chat: any, index) => (
                            <div key={index} className={`w-full flex-col  ${currentChat._id === chat._id ? "bg-[#EAEAEA]" : "hover:bg-[#F0F0F0]"} ` } onClick={() => messageUser(chat.users)}>
                                <div className="flex items-center space-x-4 p-2">
                                    <div className="p-1">
                                        <div className="h-11 w-11 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center">
                                            <img src="/images/user.png" alt="avatar" className="h-6 w-6 object-cover" />
                                        </div>
                                    </div>
                                    <div className=" w-full">
                                        <div className=" w-full" >
                                            <h1 className="text-lg font-sans">{chat.users[0].username !== loggedUsername ? chat.users[0].username : chat.users[1].username}</h1>
                                            <p className="text-sm text-gray-500 font-sans">{chat.lastMessageSender === loggedUsername ? "You: " : !chat.lastMessageSender ? "" : chat.lastMessageSender+": "}{chat.lastMessage?.length+chat.lastMessageSender?.length > 29 ? chat.lastMessage.slice(0,29-chat.lastMessageSender?.length)+"..." : chat.lastMessage}</p>
                                        </div>
                                    </div>
                                    <div>
                                    {chat.unreadMessages?.find((user: any) => user.username === loggedUsername && user.userRole === loggedRole)?.count > 0 ?
                                    <div className="flex flex-col justify-center items-center space-y-2">
                                        <div className="text-blue-500 text-xs font-medium font-sans">
                                            {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                                                hour: '2-digit', 
                                                minute: '2-digit', 
                                                hour12: false 
                                            })}
                                        </div>
                                        <div className="bg-blue-500 h-5 w-5 rounded-full flex justify-center items-center text-white text-xs font-sans"> 
                                            {chat.unreadMessages.find((user: any) => user.username === loggedUsername)?.count}
                                        </div>
                                    </div>
                                        :null
                                    }

                                    </div>
                                </div>
                                <div className="w-full flex justify-end">
                                    <div className="bg-[#F0F0F0] h-[0.5px] w-[85%] "></div>
                                </div>
                            </div>
                            )):
                            <div className="w-full h-full p-4 flex flex-col space-y-3 animate-pulse">
                                {
                                    Array(6).fill(0).map((_, index) => (
                                        <div key={index} className="w-full flex-col hover:bg-[#F0F0F0] ">
                                            <div className="flex items-center space-x-4 p-2">
                                                <div className="p-1">
                                                    <div className="h-11 w-11 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center">
                                                        <Skeleton style={{ height:40, width:40}} />
                                                    </div>
                                                </div>
                                                <div className=" w-full">
                                                    <div className=" w-full" >
                                                        <Skeleton style={{ height:20, width:100}} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full flex justify-end">
                                                <div className="bg-[#F0F0F0] h-[0.5px] w-[85%] "></div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                        </div> 

                        

                    </div>
                    {currentChat._id ? (
                    <div className="w-4/6 bg-gray-200 rounded-tr-lg rounded-br-lg">
                        <div className="bg-[#F0F0F0] h-[10%] flex items-center space-x-4 px-3 rounded-tr-lg" >
                            <div className="">
                                <div className="h-11 w-11 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center">
                                    <img src="/images/user.png" alt="avatar" className="h-6 w-6 object-cover" />
                                </div>
                            </div>
                            <div className="flex-col justify-center items-center ">
                                <p className="text-lg font-sans">{currentChat?.users[0]?.username !== loggedUsername ? currentChat?.users[0]?.username : currentChat?.users[1]?.username}</p>
                                {isTyping ? 
                                    <p className="text-sm text-gray">Typing...</p> : 
                                    <p className="text-sm text-gray">{currentChat?.users[0]?.username !== loggedUsername ? currentChat?.users[0]?.userRole : currentChat?.users[1]?.userRole}</p>
                                }                            
                            </div>
                            <div className=" w-full flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="outline-none">
                                       <div className="rounded-full h-8 w-8 flex items-center justify-center cursor-pointer hover:bg-gray-300">
                                           <EllipsisVertical size={20}  className="text-gray-500"/> 
                                       </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-48 mr-36">
                                        <DropdownMenuLabel className="text-gray-500">Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer hover:bg-[#F0F0F0]">Clear Chat</DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer hover:bg-[#F0F0F0]">Delete Chat</DropdownMenuItem>
                                    </DropdownMenuContent>
                                
                                </DropdownMenu>
                               
                            </div>
                        </div>
                        {!loading ? 
                        <div className={`bg-[#EAE6DF] h-[80%] overflow-auto p-2`} ref={messagesEndRef}>
                            {messages.map((message: any, index) => (
                                message?.sender?.username === loggedUsername ? (
                                    <div key={index} className="flex justify-end my-2">
                                        <div className="bg-blue-500 px-3 py-2 rounded-lg max-w-lg flex gap-2">
                                            <div className=" break-words overflow-hidden font-sans  text-white">
                                                {message.message}
                                            </div>
                                            <div className="flex justify-end items-end gap-1">
                                                <div>
                                                    <p className="text-xs text-white font-sans">
                                                        {   
                                                            message.createdAt? 
                                                                new Date(message.createdAt).toLocaleTimeString([], { 
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit', 
                                                                    hour12: false 
                                                                })
                                                             : 
                                                                new Date(Date.now()).toLocaleTimeString([], {
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit', 
                                                                    hour12: false 
                                                                })

                                                            
                                                    }
                                                    </p>

                                                </div>
                                                <div className="flex justify-end items-end">
                                                    <CheckCheck size={16} className={message.readBy?.some((user: { username: string; userRole: string }) => user.username !== message.sender.username || user.userRole !== message.sender.userRole) ? "text-white " : "text-blue-900 "} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                ) : (
                                    <div key={index} className="flex justify-start ml-2 my-2">
                                        <div className="bg-gray-300 px-3 py-2 rounded-lg max-w-lg flex gap-2">
                                            <div className=" break-words overflow-hidden font-sans text-black">
                                                {message.message}
                                            </div>
                                            <div className="flex justify-end items-end gap-1">
                                                <p className="text-xs text-gray-500 font-sans">
                                                    {   
                                                        message.createdAt ? 
                                                            new Date(message.createdAt).toLocaleTimeString([], { 
                                                                hour: '2-digit', 
                                                                minute: '2-digit', 
                                                                hour12: false 
                                                            })
                                                        : 
                                                            new Date(Date.now()).toLocaleTimeString([], {
                                                                hour: '2-digit', 
                                                                minute: '2-digit', 
                                                                hour12: false 
                                                            })
                                                    }
                                                </p>
                                            </div>
                                            </div>
                                    </div>
                                )
                            ))     
                            }
                        </div>
                        :
                        <div className="w-full h-full p-4 flex flex-col space-y-3 animate-pulse">
                            {
                                Array(9).fill(0).map((_, index) => (
                                    <div key={index} className={index%2 == 0 ? `flex justify-end my-2 ` : `flex justify-start my-2`}>
                                        <div className="">
                                            <Skeleton style={{ height:40, width:250}} />
                                        </div>
                                    </div>
                                ))
                            }
                            <div>
                                <Skeleton style={{ height:45}} />
                            </div>
                            
                    
                        </div>
                    
                        }
                        {!loading ?
                        <div className="w-full h-[10%]  flex justify-center items-center bg-[#F0F0F0] space-x-2 rounded-br-lg">
                            <textarea
                                placeholder="Type a message..."
                                className="w-[80%] h-[70%] rounded-md outline-none resize-none px-3 py-2 font-sans"
                                onChange={(e) => {
                                    setMessage(e.target.value)
                                    handleTyping(); 
                                    }
                                }  
                                value={message}   
                                onKeyDown={(e) => {
                                    if ( message && e.key === 'Enter') {
                                        sendNewMessage();
                                        e.preventDefault();
                                    }
                                }}
                            />
                            <SendHorizonal size={24} className="text-[#5a5858] cursor-pointer" onClick={sendNewMessage} />
                        </div>
                        :null}
                    </div>):
                    (
                        <div className="w-4/6 bg-gray-200  text-white rounded-br-lg rounded-tr-lg shadow-lg flex flex-col justify-center items-center p-8">
    
                        {/* Chat Icon or Illustration */}
                        <div className="mb-4">
                            {/* <img src="/images/chat-illustration.png" alt="Chat Illustration" className="w-32 h-32 animate-bounce" /> */}
                            <MessageCircle size={64} className="text-blue-500 animate-bounce" />
                        </div>
                    
                        {/* Welcome Message */}
                        <h1 className="text-4xl font-bold text-gray-700 font-sans text-center drop-shadow-md animate-fade-in">
                            Welcome to Skillcase
                        </h1>
                    
                        {/* Subtitle */}
                        <p className="text-lg text-center text-gray-600 text- font-medium font-sans mt-2 animate-fade-in">
                            Select a chat to start messaging
                        </p>
                    </div>
                    
                )}
                </div>
            </div>
        </div>
        </>

    )
}

export default Chats;