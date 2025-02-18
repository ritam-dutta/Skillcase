import { createContext, useContext, useState } from "react";

const NotificationContext = createContext<{
    noOfMessages: number,
    setNoOfMessages: React.Dispatch<React.SetStateAction<number>>,
    noOfSenders: number,
    setNoOfSenders: React.Dispatch<React.SetStateAction<number>>,
    notifications: any[],
    setNotifications: React.Dispatch<React.SetStateAction<any[]>>,
    unreadNotifications: any[],
    setUnreadNotifications: React.Dispatch<React.SetStateAction<any[]>>,
    gotNotification: boolean,
    setGotNotification: React.Dispatch<React.SetStateAction<boolean>>
}>({
  noOfMessages: 0,
  setNoOfMessages: () => {},
  noOfSenders: 0,
  setNoOfSenders: () => {},
  notifications: [],
  setNotifications: () => {},
  unreadNotifications: [],
  setUnreadNotifications: () => {},
  gotNotification: false,
  setGotNotification: () => {}
})


export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children } : { children : React.ReactNode }) => {
    const [noOfMessages, setNoOfMessages] = useState(0);
    const [noOfSenders, setNoOfSenders] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState<any[]>([]);
    const [gotNotification, setGotNotification] = useState(false);
    
    return (
        <NotificationContext.Provider value={{ noOfMessages, setNoOfMessages, noOfSenders, setNoOfSenders, notifications, setNotifications, unreadNotifications, setUnreadNotifications, gotNotification, setGotNotification }}>
        {children}
        </NotificationContext.Provider>
    );
    }
