import { Router } from "express";
import { issueBook,returnBook,renewBook,getMyActiveIssues,getMyHistory,getOverdueBooks,updateFineStatus } from "../controllers/issue.controller.js";
import { verifyJWT,authorizeRoles } from "../middleware/auth.middleware.js";
import { validate} from "../middleware/validate.middleware.js"; 
import { issueBookSchema, returnBookSchema, renewBookSchema, updateFineStatusSchema } from "../schemas/issue.schema.js";


const router = Router();

//admin routes
router.route("/issue-book").post(verifyJWT,authorizeRoles("ADMIN"),validate(issueBookSchema),issueBook);
router.route("/return-book/:issueId").patch(verifyJWT,authorizeRoles("ADMIN"),validate(returnBookSchema),returnBook);
// router.route("/all-issued-books").get(verifyJWT,authorizeRoles("ADMIN"),getAllIssuedBooks);
router.route("/renew-book/:issueId").patch(verifyJWT,authorizeRoles("ADMIN"),validate(renewBookSchema),renewBook);
router.route("/overdue-books").get(verifyJWT,authorizeRoles("ADMIN"),getOverdueBooks);
router.route("/update-fine-status").patch(verifyJWT,authorizeRoles("ADMIN"),validate(updateFineStatusSchema),updateFineStatus);
//user routes
router.route("/my-active-issues").get(verifyJWT,getMyActiveIssues);
router.route("/my-history").get(verifyJWT,getMyHistory);

export default router;