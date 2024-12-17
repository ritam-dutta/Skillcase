import { Router } from "express";
import {
    registerFreelancer,
    loginFreelancer,
    logoutFreelancer,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentFreelancer,
    updateAccountDetails,
    updateFreelancerAvatar
} from "../controllers/freelancer.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
// import { get } from "mongoose";

const freelancerRouter = Router();

freelancerRouter.route("/freelancer_register").post(
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
freelancerRouter.route("/freelancer_login").post(loginFreelancer);

freelancerRouter.route("/freelancer_logout").post(verifyJWT, logoutFreelancer);

freelancerRouter.route("/refresh_token").post(refreshAccessToken);

freelancerRouter.route("/change_password").post(verifyJWT, changeCurrentPassword);

freelancerRouter.route("/current_freelancer").get(verifyJWT, getCurrentFreelancer);

freelancerRouter.route("/update_account").post(verifyJWT, updateAccountDetails);

freelancerRouter.route("/update_avatar").post(verifyJWT, upload.single("avatar"), updateFreelancerAvatar);
export default freelancerRouter;