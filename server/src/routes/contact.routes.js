import { Router } from "express";
import { submitContactMessage, getAllContactMessages, getContactMessageById, updateContactMessageStatus } from "../controllers/contact.controller.js";
import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { submitContactMessageSchema, updateContactStatusSchema } from "../schemas/contact.schema.js";
import { contactLimiter } from "../middleware/rateLimiter.middleware.js";
const router = Router();

// public route — no auth required, anyone can submit the contact form
router.route("/").post(contactLimiter, validate(submitContactMessageSchema), submitContactMessage);
// admin routes
router.route("/all").get(verifyJWT, authorizeRoles("ADMIN"), getAllContactMessages);
router.route("/:messageId").get(verifyJWT, authorizeRoles("ADMIN"), getContactMessageById);
router.route("/:messageId/status").patch(verifyJWT, authorizeRoles("ADMIN"), validate(updateContactStatusSchema), updateContactMessageStatus);

export default router;