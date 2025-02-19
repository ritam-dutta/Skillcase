import { Router } from "express";
import {
    registerClient,
    loginClient,
    logoutClient,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentClient,
    getLoggedInClient,
    updateAccountDetails,
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
    deleteAllNotifications,
    acceptApplication,
    acceptCollaboration,
    // demo
} from "../controllers/client.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const clientRouter = Router();

clientRouter.route("/register").post(registerClient);

clientRouter.route("/login").post(loginClient);

clientRouter.route("/logout").post(verifyJWT, logoutClient);

clientRouter.route("/refresh_token").post(refreshAccessToken);

clientRouter.route("/change_password").post(verifyJWT, changeCurrentPassword);

clientRouter.route("/loggedInClient").get(verifyJWT, getLoggedInClient);

clientRouter.route("/profile/:username").get(verifyJWT, getCurrentClient);

clientRouter.route("/update_account/:username").post(verifyJWT, updateAccountDetails);

clientRouter.route("/follow/:username").post(verifyJWT, followAccount);

clientRouter.route("/unfollow/:username").post(verifyJWT, unFollowAccount);

clientRouter.route("/connect/:username").post(verifyJWT, connectAccount);

clientRouter.route("/disconnect/:username").post(verifyJWT, disconnectAccount);

clientRouter.route("/getfollowers/:username").get(getFollowers);

clientRouter.route("/getfollowings/:username").get(getFollowings);

clientRouter.route("/getconnections/:username").get(getConnections);

clientRouter.route("/send_notification/:username").post(verifyJWT, createNotification);

clientRouter.route("/get_notifications/:username").get(verifyJWT, getNotifications);

clientRouter.route("/delete_notification/:username").post(verifyJWT, deleteNotification);

clientRouter.route("/delete_all_notifications/:username").post(verifyJWT, deleteAllNotifications);

clientRouter.route("/accept_application/:username").post(verifyJWT, acceptApplication);

clientRouter.route("/accept_collaboration/:username").post(verifyJWT, acceptCollaboration);

// clientRouter.route("/demo").get(verifyJWT,demo);

// clientRouter.route("/:username/update_avatar").post(verifyJWT, upload.single("avatar"), updateClientAvatar);

export default clientRouter;