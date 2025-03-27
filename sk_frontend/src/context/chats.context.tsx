import { createContext, useContext, useState } from "react";

const ChatContext = createContext<{
    unreadMessages: any[],
    setUnreadMessages: React.Dispatch<React.SetStateAction<any[]>>,
}>({
    unreadMessages: [],
    setUnreadMessages: () => {},
})

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children } : { children : React.ReactNode }) => {
    const [unreadMessages, setUnreadMessages] = useState<any[]>([]);

    return (
        <ChatContext.Provider value={{ unreadMessages, setUnreadMessages}}> 
        {children}
        </ChatContext.Provider>
    );
}