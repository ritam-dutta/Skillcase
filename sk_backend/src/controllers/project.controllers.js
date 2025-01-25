import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.models.js";
import { Client } from "../models/client.models.js";

const createProject = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        skills,
        budget,
        duration,
        industry,
        // employer,
        status
    } = req.body;
    const employerId = req.user._id;
    const employer = await Client.findById(employerId).select("-password -refreshToken");
    try {
        const project = await Project.create({
            title,
            description,
            skills,
            budget,
            duration,
            industry,
            employer: employer.username,
            status
        });

        if (!project) {
            return res
                .status(400)
                .json(new ApiError(400, null, "Project could not be created"));
        }

        return res
            .status(201)
            .json(new ApiResponse(201, project, "Project created successfully"));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, null, "An error occurred while creating project"));
    }
});

const getProjects = asyncHandler(async (req, res) => {
    const { status, industry, skills } = req.query;

    const query = {};

    if (status==="open") query.status = status;
    if (industry) query.industry = industry;
    if (skills) query.skills = skills;

    try {
        const projects = await Project.find(query);
        // const projects = await Project.deleteMany({title:"abc"});
        return res
            .status(200)
            .json(new ApiResponse(200, projects, "Projects fetched successfully"));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, null, "An error occurred while fetching projects"));
    }

});

const getCurrentProject = asyncHandler(async (req, res) => {
    const projectId =req.headers.projectid;
    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res
                .status(404)
                .json(new ApiError(404, null, "Project not found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, project, "Project fetched successfully"));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, null, "An error occurred while fetching project"));
    }
});

const updateProjectDetails = asyncHandler(async (req, res) => {
    console.log("entered updateproject")
    const projectId = req.headers.projectid;
    const { title, description, industry, budget, duration, status } = req.body;

    if(!title || !description || !industry || !budget || !duration || !status) {
        throw new ApiError(400, null, "All fields are required");
    }
    console.log("2nd level",projectId)
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
    updateProjectDetails,
};