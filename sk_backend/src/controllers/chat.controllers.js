import {Chat} from '../models/chat.models.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {Message} from '../models/message.models.js';
import mongoose from 'mongoose';

const createChatRoom = asyncHandler(async (req, res) => {
    const { users, isGroupChat, groupName } = req.body;
    users.sort();
    const existingChat = await Chat.findOne({
        $and: [
            { "users.username": users[0].username, "users.userRole": users[0].userRole },
            { "users.username": users[1].username, "users.userRole": users[1].userRole }
        ]
    });
    
    // console.log("existingChat: ", existingChat);
    if (existingChat) {
        console.log("existingChat");
        return res
        .status(200)
        .json(new ApiResponse("Chat room already exists", { chat: existingChat }));
    }
    const chat = await Chat.create({
        users,
        isGroupChat,
        groupName,
    });
    console.log("new chat created");
    return res
    .status(201)
    .json(new ApiResponse("Chat room created", { chat: chat }));
});

const getChats = asyncHandler(async (req, res) => {
    const { username, userRole } = req.params;
    const chats = await Chat.find({
        "users": {
            $elemMatch: {
                "username": username,
                "userRole": userRole,
            },
        },
    });
    // console.log("chats: ", chats);
    return res
    .status(200)
    .json(new ApiResponse("Chats retrieved", { chats: chats }));
});

export  
{ 
    createChatRoom,
    getChats
 };