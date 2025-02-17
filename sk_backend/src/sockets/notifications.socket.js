import { io } from "../app.js"
import axios from "axios"

export const notifications = () => {
    io.on("connection", (socket) => {
        socket.on("joinNotification", (username) => {
            console.log("joinNotification", username);
            socket.join(username);
        })
        socket.on("notification", async (data) => {

            // console.log("aagaye notifictaion", data);
            const {accessToken, notification} = data;
            // console.log("accesstoken",accessToken);

            const response = await axios.post(`http://localhost:8000/api/v1/${notification.receiverRole}/send_notification/${notification.receiver}`, {
                notification: notification,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            socket.to(notification.receiver).emit("notification", notification);
        })
        socket.on("accept connection", async (data) => {
            const {accessToken, info} = data;
            const response1 = await axios.post(`http://localhost:8000/api/v1/${info.senderRole}/connect/${info.sender}`, {
                username: info.receiver,
                connectorRole: info.receiverRole,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const response2 = await axios.post(`http://localhost:8000/api/v1/${info.senderRole}/delete_notification/${info.sender}`, {
                username: info.sender,
                type: "connection_request",
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            socket.to(info.receiver).emit("accept connection", response1.data.data);
        })
        socket.on("reject connection", async (data) => {
            // console.log("reject connection")
            const {accessToken, info} = data;
            console.log("info", info);
            const response = await axios.post(`http://localhost:8000/api/v1/${info.receiverRole}/delete_notification/${info.receiver}`, {
                username: info.receiver,
                type: "connection_request",
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("receiver", info.sender);
            socket.to(info.sender).emit("reject connection", response.data.data);
            // console.log("exit")
        })

        socket.on("delete notification", async (data) => {
            const {accessToken, info} = data;
            const response = await axios.post(`http://localhost:8000/api/v1/${info.receiverRole}/delete_notification/${info.receiver}`, {
                username: info.receiver,
                type: info.type,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            socket.to(info.receiver).emit("delete notification", response.data.data);
        })


    })
}