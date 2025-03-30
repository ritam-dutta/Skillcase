import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    users: [
        {
            username: {
                type: String,
                required: true,
            },
            userRole: {
                type: String,
                enum: ["client", "freelancer"],
                required: true,
            },
        },
    ],
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    groupName: {
        type: String,
        required: function() {
            return this.isGroupChat;
        },
    },
    lastMessage: {
        type: String,
        required: false,
    },
    lastMessageSender: {
        type: String,
        required: false,
    },
    unreadMessages:{
        type:[{username: String, userRole: String, count: Number}],
        required: false,
        default: [],
    },
    lastMessageTime: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);