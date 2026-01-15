import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { Book } from "../models/book.model.js";
import { Issue } from "../models/issue.model.js";
import apiResponse from "../utils/apiResponse.js";
import mongoose from "mongoose";
import axios from "axios";


const adjustStockInternal = async (bookId, amount) => {
    try {
        const book = await Book.findById(bookId);
        if (!book) return null;


        book.totalCopies += amount;
        book.availableCopies += amount; 

        if(book.totalCopies < 0|| book.availableCopies < 0)
        {return null}

        await book.save({ validateBeforeSave: false });
        return book;
    } catch (error) {
        console.error("Database Erorr: ", error);
        return null;
    }
};


//Admin controllers
const searchBooksByISBN = asyncHandler(async (req, res) => {
    const { isbn } = req.params;

    if (!isbn || isbn.trim() === "") {
        throw new apiError(400, "ISBN is required");
    }
    try {
        const googleURL=`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
        const response=await axios.get(googleURL);
        const data=response.data;

        if(!data.items ||data.items.length===0){
            throw new apiError(404,"No book found with the provided ISBN")
        }

        const books=data.items.map((item)=>{
            const info=item.volumeInfo;
            return{
            title:info.title,
            authors:info.authors||["Unknown Author"],
            description:info.description ||"No description available",
            thumbnail:info.imageLinks?.thumbnail ||"",
            category:info.categories ?info.categories[0] :"General",
            pageCount:info.pageCount,
            isbn: isbn
            };
        })

        return res
        .status(200)
        .json(new apiResponse(200,books,"Books fetched successfully"))
    } catch (error) {
        throw new apiError(500,"Failed to fetch book details from Google Books API")
    }

})

const addBookToLibrary = asyncHandler(async (req, res) => {
    const { title, authors,isbn,description,thumbnail,category,totalCopies } = req.body;

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
        throw new apiError(409, "Book with this ISBN already exists in the library");
    }

    const book = await Book.create({
        title,
        authors,
        isbn,
        description,
        thumbnail,
        category,
        totalCopies:totalCopies || 1,
        availableCopies:totalCopies || 1
    });

    if (!book) {
        throw new apiError(500, "Something went wrong while adding the book to the library");
    }

    return res
    .status(201)
    .json(
        new apiResponse(201, book, "Book added to library successfully")
    );
});

const updateBookDetails = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        throw new apiError(400, "Invalid book ID");
    }

    const book = await Book.findByIdAndUpdate(bookId, updates, { new: true });

    if (!book) {
        throw new apiError(400, "Something went wrong while updating book details");
    }

    return res
    .status(200)
    .json(
        new apiResponse(200, book, "Book details updated successfully")
    );
})

const deleteBookFromLibrary = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        throw new apiError(400, "Invalid book ID");
    }

    const isIssued= await Issue.findOne({bookId})

    if(isIssued){
        throw new apiError(400,"Cannot delete book as it is currently issued to a user")
    }
    
    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
        throw new apiError(400, "Something went wrong while deleting the book");
    }

    return res
    .status(200)
    .json(
        new apiResponse(200, book, "Book deleted from library successfully")
    );

})

const updateBookStock = asyncHandler(async (req, res) => {
    const {bookId}= req.params;
    const {changeInCopies}= req.body;

    const updatedBook= await adjustStockInternal(bookId,Number(changeInCopies));

    if(!updatedBook){
        throw new apiError(400," Book not found.")
    }
    
    return res
    .status(200)
    .json(
        new apiResponse(200, updatedBook, "Book stock updated successfully")
    );
})




//user controllers
const getAllBooks = asyncHandler(async (req, res) => {
    const books =await Book.find({})

    if(!books || books.length===0){
        throw new apiError(404,"No books found in the library")
    }
    return res
    .status(200)
    .json(new apiResponse(200,books,"Books fetched successfully"))
})
const getBookById = asyncHandler(async (req,res) => {
    const {bookId}= req.params;
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        throw new apiError(400, "Invalid book ID");
    }
    const book = await Book.findById(bookId);

    if(!book){
        throw new apiError(404,"Book not found")
    }

    return res
    .status(200)
    .json(new apiResponse(200,book,"Book fetched successfully"))
})

const searchLibraryBooks = asyncHandler(async (req,res) => {
    const {q}=req.query

    if(!q || q.trim()===""){
        throw new apiError(400,"Search query is required")
    }

    const books= await Book.find({
        $or:[
            {title:{$regex:q,$options:"i"}},
            {authors:{$regex:q,$options:"i"}},
        ]
    })

    if(!books || books.length===0){
        throw new apiError(404,"No books found matching the title")
    }

    return res
    .status(200)
    .json(new apiResponse(200,books,"Books found successfully"))
})

const getBooksByCategory= asyncHandler(async (req,res) => {
    const{category}= req.params
    
    if(!category || category.trim()===""){
        throw new apiError(400,"Category is required for search")
    }
    const books= await Book.find({
        category:{$regex:category,$options:"i"}
    })

    if(!books || books.length===0){
        throw new apiError(404,"No books found in this category")
    }

    return res
    .status(200)
    .json(new apiResponse(200,books,"Books fetched successfully"))
})
export {searchBooksByISBN,addBookToLibrary,getAllBooks,updateBookDetails,deleteBookFromLibrary,updateBookStock,getBookById,getBooksByCategory,searchLibraryBooks,adjustStockInternal};