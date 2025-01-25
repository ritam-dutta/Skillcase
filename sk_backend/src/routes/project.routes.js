import { Router } from "express";
import { createProject, getProjects, getCurrentProject, updateProjectDetails } from "../controllers/project.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const projectRouter = Router();

projectRouter.route("/uploadproject").post(verifyJWT, createProject);

projectRouter.route("/getprojects").get(getProjects);

projectRouter.route("/currentproject").get(verifyJWT, getCurrentProject);

projectRouter.route("/updateproject").post(verifyJWT, updateProjectDetails);

export default projectRouter;

