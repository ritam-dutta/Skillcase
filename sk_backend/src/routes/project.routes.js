import { Router } from "express";
import { createProject, getProjects, getUserProjects,getCurrentProject, updateProjectDetails} from "../controllers/project.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const projectRouter = Router();

projectRouter.route("/uploadproject").post(verifyJWT, createProject);

projectRouter.route("/getprojects").get(getProjects);

projectRouter.route("/getuserprojects").get(verifyJWT, getUserProjects);

projectRouter.route("/currentproject").get(getCurrentProject);

projectRouter.route("/updateproject").post(verifyJWT, updateProjectDetails);

export default projectRouter;

