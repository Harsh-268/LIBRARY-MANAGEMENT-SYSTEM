import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";   
import { Issue } from "../models/issue.model.js";
import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";

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

    const categoryStats = await Book.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

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
        inventory: categoryStats
    };

    return res.status(200).json(
        new apiResponse(200, stats, "Dashboard stats fetched successfully")
    );
});

export { getAdminStats };