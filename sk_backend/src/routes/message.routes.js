import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { sendMessage } from "../controllers/message.controllers.js";

const messageRouter = Router();

messageRouter.route("/send_message").post(verifyJWT, sendMessage );

export default messageRouter;