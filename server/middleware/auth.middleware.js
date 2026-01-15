import asyncHandler from "../src/utils/asyncHandler.js";
import apiError from "../src/utils/apiError.js";
import { User } from "../src/models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT =asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new apiError(401,"Unauthorized request")
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user=await User.findById(decodedToken._id).select("-password");
        if(!user){
            throw new apiError(401,"Invlalid access token")
        }
        req.user=user;
        next();
    } catch (error) {
        throw new apiError(401,error?.message || "Invalid access token")
    }
})


export const authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user?.role)){

            return next(new apiError(403,"You are not authorized to access this route"))
        }
        next()
    }
}