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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: false,
    },
}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);