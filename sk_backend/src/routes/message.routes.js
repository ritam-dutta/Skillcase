import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import 
{ 
    sendMessage, 
    getMessages,
    getLatestMessage,
    markMessageAsRead,
    markMessagesAsRead
} 
from "../controllers/message.controllers.js";

const messageRouter = Router();

messageRouter.route("/send_message/:chatId").post(verifyJWT, sendMessage );

messageRouter.route("/get_messages/:chatId").get(verifyJWT, getMessages);

messageRouter.route("/get_latest_message/:chatId").get(verifyJWT, getLatestMessage);

messageRouter.route("/mark_as_read").post(verifyJWT, markMessageAsRead);

messageRouter.route("/mark_all_as_read").post(verifyJWT, markMessagesAsRead);

export default messageRouter;