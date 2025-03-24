import {Chat} from '../models/chat.models.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {Message} from '../models/message.models.js';
import mongoose from 'mongoose';

const createChatRoom = asyncHandler(async (req, res) => {
    const { users, isGroupChat, groupName } = req.body;
    console.log("users", users);
    const existingChat = await Chat.findOne({ users });
    if (existingChat) {
        return res
        .status(200)
        .json(new ApiResponse("Chat room already exists", { chat: existingChat }));
    }
    const chat = await Chat.create({
        users,
        isGroupChat,
        groupName,
    });

    return res
    .status(201)
    .json(new ApiResponse("Chat room created", { chat: chat }));
});

export  { createChatRoom };