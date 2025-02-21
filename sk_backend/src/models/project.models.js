import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // skills: {
    //     type: [String],
    //     required: true,
    // },
    budget: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    industry: {
        type: String,
        required: true,
    },
    employer: {
        type: String,
        required: true,
    },
    collaborators: {
        type: Array,
        required: false,
    },
    requests: {
        type: Array,
        required: false,
    },
    freelancers: {
        type: Array,
        required: false,
    },
    status: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);