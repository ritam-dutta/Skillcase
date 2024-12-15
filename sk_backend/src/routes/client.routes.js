import { Router } from "express";
import {
    registerClient,
    loginClient,
    logoutClient,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentClient,
    updateAccountDetails
} from "../controllers/client.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const clientRouter = Router();

clientRouter.route("/client_register").post(registerClient);

clientRouter.route("/client_login").post(loginClient);

clientRouter.route("/client_logout").post(verifyJWT, logoutClient);

clientRouter.route("/refresh_token").post(refreshAccessToken);

clientRouter.route("/change_password").post(verifyJWT, changeCurrentPassword);

clientRouter.route("/current_client").get(verifyJWT, getCurrentClient);

clientRouter.route("/update_account").patch(verifyJWT, updateAccountDetails);

export default clientRouter;