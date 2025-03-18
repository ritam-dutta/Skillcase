import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.models.js";
import { Client } from "../models/client.models.js";

const createProject = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        budget,
        duration,
        industry,
        // employer,
        status
    } = req.body;
    const employerId = req.user._id;
    const employer = await Client.findById(employerId).select("-password -refreshToken");
    console.log(title, description, budget, duration, industry, employer.username, status)
    const project = await Project.create({
        title,
        description,
        budget,
        duration,
        industry,
        employer: employer.username,
        status
    });
    await Client.findByIdAndUpdate(employerId, { $push: { projects: project._id } });

    if (!project) {
        return res
            .status(400)
            .json(new ApiError(400, null, "Project could not be created"));
    }

    return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
    
});

const getProjects = asyncHandler(async (req, res) => {

    const query = {};
    const projects = await Project.find(query);
    // const projects = await Project.deleteMany({title:"abc"});
    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Projects fetched successfully"));
    

});

const getUserProjects = asyncHandler(async (req, res) => {

    const user = req.headers.username;
    const role = req.headers.role || "";
    let projects = {};
    if(role === "freelancer") {
        projects = await Project.find({freelancers : user});
    }
    else {
        projects = await Project.find({
            $or: [
            { employer: user },
            { collaborators: user }
            ]
        });
        
    }
    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Projects fetched successfully"));
    

});

const getCurrentProject = asyncHandler(async (req, res) => {
    const projectId =req.headers.projectid;
    const project = await Project.findById(projectId);

    if (!project) {
        return res
            .status(404)
            .json(new ApiError(404, null, "Project not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project fetched successfully"));
    
});

const updateProjectDetails = asyncHandler(async (req, res) => {
    // console.log("entered updateproject")
    const projectId = req.headers.projectid;
    const { title, description, industry, budget, duration, status } = req.body;

    if(!title || !description || !industry || !budget || !duration || !status) {
        throw new ApiError(400, null, "All fields are required");
    }
    // console.log("2nd level",projectId)
    const project = await Project.findByIdAndUpdate(
        projectId,
        { 
            $set: { title, description, industry, budget, duration, status } 
        },
        { 
            new: true 
        }
    );
    return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
    
});


export 
{   createProject,
    getProjects,
    getCurrentProject,
    getUserProjects,
    updateProjectDetails,
};