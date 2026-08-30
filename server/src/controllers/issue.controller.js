import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { Issue } from "../models/issue.model.js";
import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { paginate } from "../utils/paginate.js";


//admin controllers
const issueBook=asyncHandler(async(req,res)=>{
    const {bookId,userId}=req.body

    if(!bookId||!userId){
        throw new apiError(400,"Book ID and User ID are required")
    }


    const session=await mongoose.startSession()
    session.startTransaction()
    try {
        const updatedBook=await Book.findOneAndUpdate(
            {_id:bookId,availableCopies:{$gt:0}},
            {$inc:{availableCopies:-1}},
            {new:true,session}
        );

        if(!updatedBook){
            throw new apiError(404,"Book is unavailable or does not exist")
        }

        const updatedUser=await User.findOneAndUpdate(
            {_id:userId,borrowedBooks:{$ne:bookId},"borrowedBooks.2":{$exists:false}},
            {$push:{borrowedBooks:bookId}},
            {new:true,session}
        )

        if(!updatedUser){
            throw new apiError(404,"User not found or has already borrowed maximum allowed copies of this book")
        }

        const [issueRecord]=await Issue.create(
            [{
                book:bookId,
                user:userId
            }],
            {session}
        )

        await session.commitTransaction()

        return res
        .status(201)
        .json(new apiResponse(201,{issueRecord,updatedBook,updatedUser},"Book issued successfully"))
    } catch (error) {
        await session.abortTransaction()
        throw error
    }finally{
        session.endSession()
    }
    
})


const returnBook=asyncHandler(async(req,res)=>{ 
    const {issueId}=req.params

    if(!issueId){
        throw new apiError(400,"Issue ID is required")
    }

   
    const session=await mongoose.startSession()
    session.startTransaction()
    try {

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
        issueRecord.fineStatus = fine > 0 ? "UNPAID" : "NONE" 

        await issueRecord.save({session})

        const updatedBook=await Book.findByIdAndUpdate(
            issueRecord.book,
            {$inc:{availableCopies:1}},
            {new:true,session}
        )

        const updatedUser=await User.findByIdAndUpdate(
            issueRecord.user,
            {$pull:{borrowedBooks:issueRecord.book}},
            {new:true,session}
        ).select("-password")

        await session.commitTransaction()

         return res
          .status(200)
          .json( new apiResponse(200,{issue:issueRecord,updatedBook,updatedUser},"Book returned successfully")
    )
    } catch (error) {
        await session.abortTransaction()
        if(error instanceof apiError){
            throw error
        }
        throw new apiError(500,"An error occurred while processing the return. Please try again.")
    }finally{
        session.endSession()
    }
   
})

// const getAllIssuedBooks=asyncHandler(async(req,res)=>{
//     const {page,limit}=req.query
//     const {data:issues,metadata}= await paginate({
//         model:Issue,
//         query:{status:"ISSUED"},
//         page,
//         limit,
//         populate:"book user",
//         sort:{dueDate:1}
//     })

//     return res
//     .status(200)
//     .json(new apiResponse(200,{issues,metadata},"All issued books fetched successfully"))
// })

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
    const {page,limit}=req.query
    const today=new Date()
    const {data:overdueIssues,metadata}= await paginate({
        model:Issue,
        query:{
            dueDate:{$lt:today},
            status:"ISSUED"
        },
        page,
        limit
    })

    return res
    .status(200)
    .json(new apiResponse(200,{overdueIssues,metadata},"Overdue books fetched successfully"))
})
const updateFineStatus=asyncHandler(async(req,res)=>{
    const {status,issueId}=req.body

    if(!status||!issueId){
        throw new apiError(400,"Fine status and issueId are required")
    }

    const issue = await Issue.findById(issueId);
    
    if (!issue) {
        throw new apiError(404, "Issue record not found");
    }

    // 2. Update the field (Mongoose will now track this change)
    issue.fineStatus = status.toUpperCase();

    // 3. Save it (.save() triggers ALL validators and enums by default)
    await issue.save(); 

    return res
        .status(200)
        .json(new apiResponse(200, issue, "Fine status updated successfully"));
});


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
    const {page,limit}=req.query

    const {data:history,metadata}= await paginate({
        model:Issue,
        query:{user:req.user._id,status:"RETURNED"},
        page,
        limit,
        populate:{path:"book",select:"title authors thumbnail"},
        select:"-__v -createdAt -updatedAt",
        sort:{returnDate:-1}
    })

    return res.status(200).json(
        new apiResponse(200, {history,metadata}, "Borrowing history fetched successfully")
    );
});
export {issueBook,returnBook,renewBook,getOverdueBooks,updateFineStatus,getMyActiveIssues,getMyHistory};