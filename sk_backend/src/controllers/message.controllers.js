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
    if (!newMessage) {
        return res
        .status(400)
        .json(new ApiError("Message not sent", 400));
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new Error("Chat not found");
    }

    const unreadUsers = chat.users.filter(
        (user) => user.username !== newMessage.sender.username || user.userRole !== newMessage.sender.userRole
    );

    const updatedChat = await Chat.findByIdAndUpdate(chatId,
        {
            $set: {
                lastMessage: newMessage.message,
                lastMessageSender: newMessage.sender.username,
                lastMessageTime: newMessage.createdAt,            
            },
            $inc: {
                "unreadMessages.$[elem].count": 1,
            },
        },
        { new: true,
            arrayFilters: unreadUsers.map(user => ({
                "elem.username": user.username,
                "elem.userRole": user.userRole,
            })),
            upsert: true,
        }
    );

    // console.log("chat", chat);
    return res
    .status(201)
    .json(new ApiResponse("Message sent", { message: newMessage, chat: updatedChat }));
});

const getMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    

    await Message.updateMany(
        { 
            chatId,
            "sender.username": { $ne: req.user.username }, 
            "sender.userRole": { $ne: req.user.role },
            "readBy": { 
                $not: { 
                    $elemMatch: { 
                        username: req.user.username, 
                        userRole: req.user.role 
                    } 
                }
            }
        },
        { 
            $addToSet: { 
                readBy: { 
                    username: req.user.username, 
                    userRole: req.user.role 
                }
            }
        },
    );
    
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

const markMessageAsRead = asyncHandler(async (req, res) => {
    const { messageIds, user } = req.body;
    const messages = await Message.updateMany(
        { _id: { $in: messageIds } },
        { $addToSet: { readBy: user } }
    );
    return res
    .status(200)
    .json(new ApiResponse("Messages marked as read", { messages }));
});

export 
{   sendMessage,
    getMessages,
    getLatestMessage,
    markMessageAsRead,
 };
