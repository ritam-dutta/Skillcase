import { asyncHandler } from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {Message} from '../models/message.models.js';
import {Chat} from '../models/chat.models.js';

const sendMessage = asyncHandler(async (req, res) => {
    const { chatId, message, messageType, fileUrl, role} = req.body;
    const User = role === "client" ? "client" : "freelancer";
    const sender = {
        username: req.user?.username,
        userRole: User,
    };
    
    const newMessage = await Message.create({
        chatId,
        sender,
        message,
        messageType,
        fileUrl,
    });
    const chat = await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });
    // io.to(chatId).emit("newMessage", newMessage);

    return res
    .status(201)
    .json(new ApiResponse("Message sent", { message: newMessage }));
});

export { sendMessage };
