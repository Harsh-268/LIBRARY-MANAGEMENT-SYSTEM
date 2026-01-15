import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { Issue } from "../models/issue.model.js";
import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";
import mongoose from "mongoose";
import {adjustStockInternal} from "./book.controller.js";


//admin controllers
const issueBook=asyncHandler(async(req,res)=>{
    const {bookId,userId}=req.body

    if(!bookId||!userId){
        throw new apiError(400,"Book ID and User ID are required")
    }


    const session=await mongoose.startSession()
    session.startTransaction()
    try {
    const book=await Book.findById(bookId).session(session)
    if(!book || book.availableCopies<1){
        throw new apiError(404,"Book not available")
    }

    const user=await User.findById(userId).session(session)
    if(!user){
        throw new apiError(404,"User not found")
    }

    const [issueRecord]=await Issue.create([{
        book:bookId,
        user:userId
    }],{session})

    book.availableCopies-=1
    await book.save({session,validateBeforeSave:false})

    user.borrowedBooks.push(bookId)
    await user.save({session,validateBeforeSave:false})

    await session.commitTransaction()
    session.endSession()


    return res
    .status(201)
    .json( new apiResponse(201,{issue:issueRecord,book,user},"Book issued successfully"))
} catch (error) {
    await session.abortTransaction()
    throw error
}
})


const returnBook=asyncHandler(async(req,res)=>{
    const {issueId}=req.params

    if(!issueId){
        throw new apiError(400,"Issue ID is required")
    }

    const issueRecord=await Issue.findById(issueId)
    if(!issueRecord||issueRecord.status!=="ISSUED"){
        throw new apiError(400,"No active issue record found for this book")
    }

    const today=new Date()
    const dueDate=new Date(issueRecord.dueDate)
    
    let fine=0
    if(today>dueDate){
        const diffTime=Math.abs(today-dueDate)
        const diffDays=Math.ceil(diffTime/(1000*60*60*24))
        const fineRate=50
        fine=diffDays*fineRate
    }
    issueRecord.returnDate=today
    issueRecord.status="RETURNED"
    issueRecord.fine=fine

    await issueRecord.save()

    const book= await adjustStockInternal(issueRecord.book,1)

    await User.findByIdAndUpdate(issueRecord.user,{
        $pull:{borrowedBooks:issueRecord.book}
    })

    return res
    .status(200)
    .json( new apiResponse(200,{issue:issueRecord,book},"Book returned successfully")
    )
})

const getAllIssuedBooks=asyncHandler(async(req,res)=>{
    const issues=await Issue.find()

    return res
    .status(200)
    .json(new apiResponse(200,issues,"All issued books fetched successfully"))
})

const renewBook=asyncHandler(async(req,res)=>{
    const {issueId}=req.params

    if(!issueId){
        throw new apiError(400,"Issue ID is required")
    }

    const issueRecord=await Issue.findById(issueId)
    if(!issueRecord||issueRecord.status!=="ISSUED"){
        throw new apiError(400,"No active issue record found for this book")
    
    }
    if(issueRecord.renewalCount>=2){
        throw new apiError(400,"Maximum renewal limit reached")
    }

    const today=new Date()
    const currentDueDate=new Date(issueRecord.dueDate)


    if(today>currentDueDate){
        throw new apiError(400,"Cannot renew an overdue book. Please return the book first.")
    }

    const newDueDate=new Date(issueRecord.dueDate)
    newDueDate.setDate(newDueDate.getDate()+7)
    issueRecord.renewalCount+=1

    issueRecord.dueDate=newDueDate
    await issueRecord.save()

    return res
    .status(200)
    .json( new apiResponse(200,{issue:issueRecord},"Book renewed successfully"))
})

const getOverdueBooks=asyncHandler(async(req,res)=>{
    const today=new Date()
    const overdueIssues=await Issue.find({
        dueDate:{$lt:today},
        status:"ISSUED"
    })

    return res
    .status(200)
    .json(new apiResponse(200,overdueIssues,"Overdue books fetched successfully"))
})
const updateFineStatus=asyncHandler(async(req,res)=>{
    const {status,issueId}=req.body

    if(!status||!issueId){
        throw new apiError(400,"Fine status and issueId are required")
    }

    const updateStatus= await Issue.findByIdAndUpdate(
        issueId,
        {$set:{fineStatus:status.toUpperCase()}},
        {new:true}
    )

    return res
    .status(200)
    .json(new apiResponse(200,updateStatus,"Fine status updated successfully"))

})


//user controllers
const getMyActiveIssues = asyncHandler(async (req, res) => {
    
    const activeIssues = await Issue.find({
        user: req.user._id,
        status: "ISSUED"
    })
    .populate("book", "title authors thumbnail") 
    .sort({ dueDate: 1 }); 

    return res.status(200).json(
        new apiResponse(200, activeIssues, "Active issues fetched successfully")
    );
});
const getMyHistory = asyncHandler(async (req, res) => {
    const history = await Issue.find({
        user: req.user._id,
        status: "RETURNED"
    })
    .populate("book", "title authors thumbnail")
    .sort({ returnDate: -1 }); 

    return res.status(200).json(
        new apiResponse(200, history, "Borrowing history fetched successfully")
    );
});
export {issueBook,returnBook,getAllIssuedBooks,renewBook,getOverdueBooks,updateFineStatus,getMyActiveIssues,getMyHistory};