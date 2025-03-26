import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createChatRoom, getChats } from "../controllers/chat.controllers.js";

const chatRouter = Router();

chatRouter.route("/create_chat").post( verifyJWT, createChatRoom);

chatRouter.route("/get_chats/:username/:userRole").get(verifyJWT, getChats);

export default chatRouter;
