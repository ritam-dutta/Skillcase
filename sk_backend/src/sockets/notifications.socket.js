import { io } from "../app.js"
import axios from "axios"

export const notifications = () => {
    io.on("connection", (socket) => {
        socket.on("joinNotification", (username) => {
            // console.log("joinNotification", username);
            socket.join(username);
        })
        socket.on("joinChat", (chatId) => {
            // console.log("joinChat", chatId);
            socket.join(chatId);
        })
        socket.on("notification", async (data) => {

            // console.log("aagaye notifictaion", data);
            const {accessToken, notification} = data;
            // console.log("notification",notification);

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
            const response1 = await axios.post(`http://localhost:8000/api/v1/${info.receiverRole}/connect/${info.receiver}`, {
                username: info.sender,
                connectorRole: info.senderRole,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const response2 = await axios.post(`http://localhost:8000/api/v1/${info.receiverRole}/delete_notification/${info.receiver}`, {
                sender: info.sender,
                type: "connection_request",
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            socket.to(info.sender).emit("accept connection", response1.data.data);
        })
        socket.on("reject connection", async (data) => {
            // console.log("reject connection")
            const {accessToken, info} = data;
            // console.log("info", info);
            const response = await axios.post(`http://localhost:8000/api/v1/${info.receiverRole}/delete_notification/${info.receiver}`, {
                sender: info.sender,
                type: "connection_request",
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // console.log("sender", info.sender);
            socket.to(info.sender).emit("reject connection", response.data.data);
            // console.log("exit")
        })

        socket.on("delete notification", async (data) => {
            const {accessToken, info} = data;
            const response = await axios.post(`http://localhost:8000/api/v1/${info.receiverRole}/delete_notification/${info.receiver}`, {
                sender: info.sender,
                type: info.type
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            socket.to(info.sender).emit("delete notification", response.data.data);
        })

        socket.on("delete all notifications", async (data) => {
            const {accessToken, info} = data;
            // console.log("info")
            // console.log(accessToken, info);
            await axios.post(`http://localhost:8000/api/v1/${info.userRole}/delete_all_notifications/${info.user}`, {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // socket.to(info.sender).emit("delete all notifications", response.data.data);
        })

        socket.on("accept application", async (data) => {
            const {accessToken, info} = data;
            const response1 = await axios.post(`http://localhost:8000/api/v1/client/accept_application/${info.receiver}`, {
                sender: info.sender,
                projectId: info.projectId,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const response2 = await axios.post(`http://localhost:8000/api/v1/client/delete_notification/${info.receiver}`, {
                sender: info.sender,
                type: "apply for project",
                projectId: info.projectId,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            socket.to(info.sender).emit("accept application", response1.data.data);
        })

        socket.on("reject application", async (data) => {
            const {accessToken, info} = data;
            const response = await axios.post(`http://localhost:8000/api/v1/client/delete_notification/${info.receiver}`, {
                sender: info.sender,
                type: "apply for project",
                projectId: info.projectId,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            socket.to(info.sender).emit("reject application", response.data.data);
        })

        socket.on("accept collaboration", async (data) => {
            const {accessToken, info} = data;
            const response1 = await axios.post(`http://localhost:8000/api/v1/client/accept_collaboration/${info.receiver}`, {
                sender: info.sender,
                projectId: info.projectId,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const response2 = await axios.post(`http://localhost:8000/api/v1/client/delete_notification/${info.receiver}`, {
                sender: info.sender,
                type: "collaborate on project",
                projectId: info.projectId,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            socket.to(info.sender).emit("accept collaboration", response1.data.data);
        })

        socket.on("reject collaboration", async (data) => {
            const {accessToken, info} = data;
            const response = await axios.post(`http://localhost:8000/api/v1/client/delete_notification/${info.receiver}`, {
                sender: info.sender,
                type: "collaborate on project",
                projectId: info.projectId,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            socket.to(info.sender).emit("reject collaboration", response.data.data);
        })

        socket.on("new message", async (data) => {
            const {accessToken, info} = data;
            // console.log("new message", info);
            const response = await axios.post(`http://localhost:8000/api/v1/root/send_message/${info.chatId}`, info, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
           
            socket.to(info.chatId).emit("new message", { message: response.data.data.message, chat: response.data.data.chat });
        })

        socket.on("message read", (data) => {
            const {info} = data;
            socket.to(info.chatId).emit("message read",info);
        })

        socket.on("read all", async (data) => {
            const {chatId, messages, user, accessToken} = data;
            const messageIds = messages.map((message) => message._id);
            const response = await axios.post(`http://localhost:8000/api/v1/root/mark_all_as_read`, {
                chatId,
                messageIds,
                user,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            socket.to(chatId).emit("read all",response.data.data.messages);
        })

        socket.on("all chats", (data) => {
            const {allChats, user} = data;
            // console.log("all chats", chats);
            socket.to(user).emit("all chats", allChats);
        });

        socket.on("typing", (data) => {
            socket.to(data.chatId).emit("userTyping", data);
        })

        socket.on("stop typing", (data) => {
            socket.to(data.chatId).emit("userStoppedTyping", data);
        });
        

    })
}