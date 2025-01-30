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
    followAccount,
    unFollowAccount,
    connectAccount,
    disconnectAccount,
    getFollowers,
    getFollowings,
    getConnections,
    createNotification,
    getNotifications,
    deleteNotification,
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

freelancerRouter.route("/profile/:username").get(verifyJWT, getCurrentFreelancer);

freelancerRouter.route("/loggedInFreelancer").get(verifyJWT, getLoggedInFreelancer);

freelancerRouter.route("/update_account/:username").post(verifyJWT, updateAccountDetails);

freelancerRouter.route("/follow/:username").post(verifyJWT, followAccount);

freelancerRouter.route("/unfollow/:username").post(verifyJWT, unFollowAccount);

freelancerRouter.route("/connect/:username").post(verifyJWT, connectAccount);

freelancerRouter.route("/disconnect/:username").post(verifyJWT, disconnectAccount);

freelancerRouter.route("/getfollowers/:username").get(getFollowers);

freelancerRouter.route("/getfollowings/:username").get(getFollowings);

freelancerRouter.route("/getconnections/:username").get(getConnections);

freelancerRouter.route("/create_notification").post(verifyJWT, createNotification);

freelancerRouter.route("/send_notification/:username").post(verifyJWT, createNotification);

freelancerRouter.route("/get_notifications/:username").get(verifyJWT, getNotifications);

freelancerRouter.route("/delete_notification/:username").post(verifyJWT, deleteNotification);

freelancerRouter.route("/update_avatar/:username").post(verifyJWT, upload.single("avatar"), updateFreelancerAvatar);
export default freelancerRouter;