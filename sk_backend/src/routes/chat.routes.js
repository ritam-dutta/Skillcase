import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createChatRoom } from "../controllers/chat.controllers.js";

const chatRouter = Router();

chatRouter.route("/create_chat").post( verifyJWT, createChatRoom);

export default chatRouter;
