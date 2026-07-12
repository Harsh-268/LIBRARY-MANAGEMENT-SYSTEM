import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";   
import { Issue } from "../models/issue.model.js";
import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";
import { paginate } from "../utils/paginate.js";
//controller to get stats for admin dashboard like total books, total students, active issues, overdue issues, total fine amount, total paid fine amount and category wise book count with aggregation
const getAdminStats = asyncHandler(async (req, res) => {
    
    const [
        totalBooks,
        totalStudents,
        activeIssues,
        overdueIssues
    ] = await Promise.all([
        Book.countDocuments(),
        User.countDocuments({ role: "STUDENT" }),
        Issue.countDocuments({ status: "ISSUED" }),
        Issue.countDocuments({ 
            status: "ISSUED", 
            dueDate: { $lt: new Date() } 
        })
    ]);

    
    const fineStats = await Issue.aggregate([
        {
            $group: {
                _id: null,
                totalFineAmount: { $sum: "$fine" },
                totalPaid: {
                    $sum: { $cond: [{ $eq: ["$fineStatus", "PAID"] }, "$fine", 0] }
                }
            }
        }
    ]);
    //aggregation pipeline to get total copies and available copies of books available in the library 
    const inventoryStats =await Book.find().select("title totalCopies availableCopies")

    const stats = {
        counts: {
            totalBooks,
            totalStudents,
            activeIssues,
            overdueIssues
        },
        revenue: {
            totalFineAmount: fineStats[0]?.totalFineAmount || 0,
            totalPaid: fineStats[0]?.totalPaid || 0
        },
        inventory: inventoryStats.map(item=>({
            bookId:item._id,
            title:item.title,
            totalCopies:item.totalCopies,
            availableCopies:item.availableCopies
        }))
    };

    return res.status(200).json(
        new apiResponse(200, stats, "Dashboard stats fetched successfully")
    );
});

const getActiveIssuedBooks = asyncHandler(async (req, res) => {
    //  Manual pagination math
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    //  aggregation pipeline
    const pipelineResult = await Issue.aggregate([
        { $match: { status: "ISSUED" } },
        {
            $lookup: {
                from: "books",
                localField: "book",
                foreignField: "_id",
                as: "book"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$book" },
        { $unwind: "$user" },
        {
            $project: {
                _id: 1,
                dueDate: 1,
                issueDate: 1,
                renewalCount: 1,
                "bookTitle": "$book.title",
                "bookThumbnail": "$book.thumbnail",
                "studentName": "$user.fullName",
                "studentEmail": "$user.email",
                isOverDue: { $lt: ["$dueDate", new Date()] },
            }
        },
        { $sort: { dueDate: 1 } },
        
        //  $facet stage handles the slicing
        {
            $facet: {
                metadata: [
                    { $count: "totalItems" }
                ],
                paginatedData: [
                    { $skip: skip },
                    { $limit: limit }
                ]
            }
        }
    ]);

    //  Extracting the data safely
    const result = pipelineResult[0];
    const issues = result.paginatedData;
    const totalItems = result.metadata[0]?.totalItems || 0;
    const totalPages = Math.ceil(totalItems / limit);

    //  Return standardized payload
    return res.status(200).json(
        new apiResponse(200, {
            issues,
            metadata: {
                totalItems,
                currentPage: page,
                itemsPerPage: limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        }, "All issued books fetched successfully")
    );
});

//controller to get all the transactions of the library with pagination and sorting by date in descending order
const getAllTransactions = asyncHandler(async (req, res) => {
    const {limit,page}=req.query;

    const {data:transactions,metadata}=await paginate({
        model:Issue,
        query:{},
        limit,
        page,
        sort:{createdAt:-1},
        populate:[
        { path: "book", select: "title thumbnail" },
        { path: "user", select: "fullName email" }
    ]});

    return res.status(200).json(
        new apiResponse(200, { transactions, metadata }, "All transactions fetched successfully")
    );
});

export { getAdminStats, getActiveIssuedBooks, getAllTransactions };