import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    sender: {
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
    message: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        enum: ["text", "image", "file"],
        default: "text",
    },
    fileUrl: {
        type: String,
        required: false,
    },
    readBy:{
        type: [
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
        }],
        default: [],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);