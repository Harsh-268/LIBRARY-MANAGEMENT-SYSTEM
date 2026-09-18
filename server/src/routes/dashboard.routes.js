import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { getAdminStats,getActiveIssuedBooks,getAllTransactions } from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/stats").get(verifyJWT, authorizeRoles("ADMIN"), getAdminStats);
router.route("/active-issues").get(verifyJWT, authorizeRoles("ADMIN"), getActiveIssuedBooks);
router.route("/transactions").get(verifyJWT, authorizeRoles("ADMIN"), getAllTransactions);

export default router;