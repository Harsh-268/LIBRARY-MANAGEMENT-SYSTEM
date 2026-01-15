import { Router } from "express";
import { searchBooksByISBN,addBookToLibrary,getAllBooks,updateBookDetails,deleteBookFromLibrary,updateBookStock,getBookById,searchLibraryBooks,getBooksByCategory } from "../controllers/book.controller.js";
import { verifyJWT,authorizeRoles } from "../../middleware/auth.middleware.js";

const router = Router();
//admin routes
router.route("/search/:isbn").get(verifyJWT,authorizeRoles("ADMIN"),searchBooksByISBN);
router.route("/add").post(verifyJWT,authorizeRoles("ADMIN"),addBookToLibrary);
router.route("/update/:bookId").put(verifyJWT,authorizeRoles("ADMIN"),updateBookDetails);
router.route("/delete/:bookId").delete(verifyJWT,authorizeRoles("ADMIN"),deleteBookFromLibrary);
router.route("/update-stock/:bookId").patch(verifyJWT,authorizeRoles("ADMIN"),updateBookStock);

//user routes
router.route("/search").get(verifyJWT,searchLibraryBooks);
router.route("/all-books").get(verifyJWT,getAllBooks);
router.route("/category/:category").get(verifyJWT,getBooksByCategory);
router.route("/:bookId").get(verifyJWT,getBookById);


export default router;