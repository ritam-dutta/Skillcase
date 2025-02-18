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
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
    },
    employees: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
    },
    // freelancer: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Freelancer",
    //     required: false,
    // },
    status: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);