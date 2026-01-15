import { Router } from "express";
import { issueBook,returnBook,getAllIssuedBooks,renewBook,getMyActiveIssues,getMyHistory,getOverdueBooks,updateFineStatus } from "../controllers/issue.controller.js";
import { verifyJWT,authorizeRoles } from "../../middleware/auth.middleware.js";

const router = Router();

//admin routes
router.route("/issuebook").post(verifyJWT,authorizeRoles("ADMIN"),issueBook);
router.route("/returnbook").patch(verifyJWT,authorizeRoles("ADMIN"),returnBook);
router.route("/all-issued-books").get(verifyJWT,authorizeRoles("ADMIN"),getAllIssuedBooks);
router.route("/renewbook").patch(verifyJWT,authorizeRoles("ADMIN"),renewBook);
router.route("/overdue-books").get(verifyJWT,authorizeRoles("ADMIN"),getOverdueBooks);
router.route("/update-fine-status").patch(verifyJWT,authorizeRoles("ADMIN"),updateFineStatus);

//user routes
router.route("/my-active-issues").get(verifyJWT,getMyActiveIssues);
router.route("/my-history").get(verifyJWT,getMyHistory);

export default router;