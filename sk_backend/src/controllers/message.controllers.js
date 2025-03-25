import { asyncHandler } from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {Message} from '../models/message.models.js';
import {Chat} from '../models/chat.models.js';

const sendMessage = asyncHandler(async (req, res) => {
    const { chatId,sender, message, messageType, fileUrl} = req.body;
    // const User = role === "client" ? "client" : "freelancer";
    // const sender = {
    //     username: req.user?.username,
    //     userRole: User,
    // };
    
    const newMessage = await Message.create({
        chatId,
        sender,
        message,
        messageType,
        fileUrl,
    });
    const chat = await Chat.findByIdAndUpdate(chatId,
        {
            $set: {
                lastMessage: newMessage.message,
            },
        },
        { new: true }
    );
    console.log("chat", chat);
    return res
    .status(201)
    .json(new ApiResponse("Message sent", { message: newMessage }));
});

const getMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId });

    return res
    .status(200)
    .json(new ApiResponse("Messages retrieved", { messages }));
});

const getLatestMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const message = await Message.findById(chatId);
    return res
    .status(200)
    .json(new ApiResponse("Message retrieved", { message }));
});

export 
{   sendMessage,
    getMessages,
    getLatestMessage,
 };
