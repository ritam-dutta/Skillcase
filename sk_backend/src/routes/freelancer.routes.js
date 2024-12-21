import { Router } from "express";
import {
    registerFreelancer,
    loginFreelancer,
    logoutFreelancer,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentFreelancer,
    getLoggedInFreelancer,
    updateAccountDetails,
    updateFreelancerAvatar,
} from "../controllers/freelancer.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
// import { get } from "mongoose";

const freelancerRouter = Router();

freelancerRouter.route("/register").post(
    upload.fields([
        {
            	name: "avatar",
                maxCount:1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerFreelancer
);
freelancerRouter.route("/login").post(loginFreelancer);

freelancerRouter.route("/logout").post(verifyJWT, logoutFreelancer);

freelancerRouter.route("/refresh_token").post(refreshAccessToken);

freelancerRouter.route("/change_password").post(verifyJWT, changeCurrentPassword);

freelancerRouter.route("/:username").get(verifyJWT, getCurrentFreelancer);

freelancerRouter.route("/loggedInFreelancer").get(verifyJWT, getLoggedInFreelancer);

freelancerRouter.route("/:username/update_account").post(verifyJWT, updateAccountDetails);

freelancerRouter.route("/:username/update_avatar").post(verifyJWT, upload.single("avatar"), updateFreelancerAvatar);
export default freelancerRouter;