import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { getAdminStats,getActiveIssuedBooks } from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/stats").get(verifyJWT, authorizeRoles("ADMIN"), getAdminStats);
router.route("/active-issues").get(verifyJWT, authorizeRoles("ADMIN"), getActiveIssuedBooks);

export default router;