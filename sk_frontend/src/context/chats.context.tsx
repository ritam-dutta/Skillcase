import { createContext, useContext, useState } from "react";

const ChatContext = createContext<{
    unreadChats: any[],
    setUnreadChats: React.Dispatch<React.SetStateAction<any[]>>,
}>({
    unreadChats: [],
    setUnreadChats: () => {},
})

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children } : { children : React.ReactNode }) => {
    const [unreadChats, setUnreadChats] = useState<any[]>([]);

    return (
        <ChatContext.Provider value={{ unreadChats, setUnreadChats}}> 
        {children}
        </ChatContext.Provider>
    );
}