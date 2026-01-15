import { Router } from "express";
import { registerUser,loginUser, logoutUser, refreshAccessToken,changeUserPassword,getCurrentUser,updateUserInfo,getUserBorrowHistory,getAllUsers } from "../controllers/user.controller.js";
import { verifyJWT,authorizeRoles } from "../../middleware/auth.middleware.js";

const router = Router();


router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT,changeUserPassword);

router.route("/current-user").get(verifyJWT,getCurrentUser);

router.route("/update-account").put(verifyJWT,updateUserInfo);

router.route("/history").get(verifyJWT,getUserBorrowHistory);

router.route("/all-users").get(verifyJWT,authorizeRoles("ADMIN"),getAllUsers);

export default router;