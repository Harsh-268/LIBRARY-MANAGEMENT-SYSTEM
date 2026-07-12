import { Router } from "express";
import { registerUser,loginUser, logoutUser, refreshAccessToken,changeUserPassword,getCurrentUser,updateUserInfo,getUserBorrowHistory,getAllUsers,updateUserRole } from "../controllers/user.controller.js";
import { verifyJWT,authorizeRoles } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerUserSchema, loginUserSchema, changeUserPasswordSchema, updateUserInfoSchema, updateUserRoleSchema } from "../schemas/user.schema.js";

const router = Router();


router.route("/register").post(validate(registerUserSchema), registerUser);

router.route("/login").post(validate(loginUserSchema), loginUser);

router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT,validate(changeUserPasswordSchema),changeUserPassword);

router.route("/current-user").get(verifyJWT,getCurrentUser);

router.route("/update-account").patch(verifyJWT,validate(updateUserInfoSchema),updateUserInfo);
router.route("/history").get(verifyJWT,getUserBorrowHistory);

router.route("/all-users").get(verifyJWT,authorizeRoles("ADMIN"),getAllUsers);

router.route("/update-role").patch(verifyJWT,authorizeRoles("ADMIN"),validate(updateUserRoleSchema),updateUserRole);

export default router;