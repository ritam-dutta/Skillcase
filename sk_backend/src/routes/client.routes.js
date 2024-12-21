import { Router } from "express";
import {
    registerClient,
    loginClient,
    logoutClient,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentClient,
    getLoggedInClient,
    updateAccountDetails
} from "../controllers/client.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const clientRouter = Router();

clientRouter.route("/register").post(registerClient);

clientRouter.route("/login").post(loginClient);

clientRouter.route("/logout").post(verifyJWT, logoutClient);

clientRouter.route("/refresh_token").post(refreshAccessToken);

clientRouter.route("/change_password").post(verifyJWT, changeCurrentPassword);

clientRouter.route("/:username").get(verifyJWT, getCurrentClient);

clientRouter.route("/loggedInClient").get(verifyJWT, getLoggedInClient);

clientRouter.route("/:username/update_account").post(verifyJWT, updateAccountDetails);

// clientRouter.route("/:username/update_avatar").post(verifyJWT, upload.single("avatar"), updateClientAvatar);

export default clientRouter;