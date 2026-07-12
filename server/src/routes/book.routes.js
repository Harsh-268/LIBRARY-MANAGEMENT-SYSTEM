import { Router } from "express";
import { searchBooksByISBN,addBookToLibrary,getAllBooks,updateBookDetails,deleteBookFromLibrary,updateBookStock,getBookById,searchLibraryBooks,getBooksByCategory } from "../controllers/book.controller.js";
import { verifyJWT,authorizeRoles } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { searchBooksByISBNSchema,addBookToLibrarySchema,updateBookDetailsSchema,deleteBookFromLibrarySchema,updateBookStockSchema,searchBookByIdSchema,searchLibraryBooksSchema,searchBooksByCategorySchema } from "../schemas/book.schema.js";


const router = Router();
//admin routes
router.route("/add").post(verifyJWT,authorizeRoles("ADMIN"),validate(addBookToLibrarySchema),addBookToLibrary);
router.route("/search/:isbn").get(verifyJWT,authorizeRoles("ADMIN"),validate(searchBooksByISBNSchema),searchBooksByISBN);
router.route("/update/:bookId").patch(verifyJWT,authorizeRoles("ADMIN"),validate(updateBookDetailsSchema),updateBookDetails);
router.route("/delete/:bookId").delete(verifyJWT,authorizeRoles("ADMIN"),validate(deleteBookFromLibrarySchema),deleteBookFromLibrary);
router.route("/update-stock/:bookId").patch(verifyJWT,authorizeRoles("ADMIN"),validate(updateBookStockSchema),updateBookStock);

//user routes
router.route("/search").get(verifyJWT,validate(searchLibraryBooksSchema),searchLibraryBooks);
router.route("/all-books").get(verifyJWT,getAllBooks);
router.route("/category/:category").get(verifyJWT,validate(searchBooksByCategorySchema),getBooksByCategory);
router.route("/book/:bookId").get(verifyJWT,validate(searchBookByIdSchema),getBookById);

export default router;