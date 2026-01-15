import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../../middleware/auth.middleware.js";
import { getAdminStats } from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/stats").get(verifyJWT, authorizeRoles("ADMIN"), getAdminStats);

export default router;