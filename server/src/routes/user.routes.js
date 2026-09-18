import { Router } from "express";
import { registerUser,loginUser, logoutUser, refreshAccessToken,changeUserPassword,getCurrentUser,updateUserInfo,getUserBorrowHistory,getAllUsers,searchStudents,updateUserRole,forgotPassword,resetPassword } from "../controllers/user.controller.js";
import { verifyJWT,authorizeRoles } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerUserSchema, loginUserSchema, changeUserPasswordSchema, updateUserInfoSchema, updateUserRoleSchema,forgotPasswordSchema,resetPasswordSchema,searchStudentsSchema } from "../schemas/user.schema.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";

    
const router = Router();


router.route("/register").post(authLimiter, validate(registerUserSchema), registerUser);

router.route("/login").post(authLimiter, validate(loginUserSchema), loginUser);

router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT,validate(changeUserPasswordSchema),changeUserPassword);

router.route("/current-user").get(verifyJWT,getCurrentUser);

router.route("/update-account").patch(verifyJWT,validate(updateUserInfoSchema),updateUserInfo);

router.route("/history").get(verifyJWT,getUserBorrowHistory);

router.route("/all-users").get(verifyJWT,authorizeRoles("ADMIN"),getAllUsers);

router.route("/search-students").get(verifyJWT,authorizeRoles("ADMIN"),validate(searchStudentsSchema),searchStudents);

router.route("/update-role").patch(verifyJWT,authorizeRoles("ADMIN"),validate(updateUserRoleSchema),updateUserRole);

router.route("/forgot-password").post(validate(forgotPasswordSchema), forgotPassword);

router.route("/reset-password/:token").post(validate(resetPasswordSchema), resetPassword);

export default router;