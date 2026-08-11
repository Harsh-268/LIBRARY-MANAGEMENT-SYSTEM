import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { paginate } from "../utils/paginate.js";


const generateAccessAndRefreshToken =async(userId)=>{
   try {
     const user= await User.findById(userId)
     if(!user){
         throw new apiError(404,"User not found")
     }
     const accessToken=await user.generateAccessToken()
     const refreshToken=await user.generateRefreshToken()
 
     user.refreshToken=refreshToken
     await user.save({validateBeforeSave:false})
 
     return{accessToken,refreshToken}
   } catch (error) {
        throw new apiError(error?.statusCode || 500,error?.message || "Something went wrong while generating access and refresh token")
   }
     
}

const registerUser = asyncHandler(async (req, res) => {
   
    const { fullName, email, password} = req.body;

   
    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

   
    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new apiError(409, "User with this email already exists");
    }

  
    const user = await User.create({
        fullName,
        email,
        password,
        role:"STUDENT" 
    });

   
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user");
    }

   
    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

    const user= await User.findOne({email})
    if(!user){
        throw new apiError(401,"Invalid credentials")
    }
    const isPasswordCorrect= await user.isPasswordCorrect(password)
    if(!isPasswordCorrect){
        throw new apiError(401,"Invalid credentials")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user)

    const loggedInUser= user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    const options={
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:24*60*60*1000
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User logged in successfully")
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{refreshToken:undefined}
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new apiResponse(200,{},"User logged out successfully")
    )
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401,"Unauthorized request")
    }
   try {
     const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
     const user = await User.findById(decodedToken?._id)
     if(!user){
         throw new apiError(401,"Invalid refresh token")
     }
 
     if(incomingRefreshToken!==user?.refreshToken){
        user.refreshToken=undefined
        await user.save({validateBeforeSave:false})
         throw new apiError(401,"Refresh token is expired or used.Please login again")
     }
 
     const options={
         httpOnly:true,
         secure:true
 
     }
 
     const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
 
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
         new apiResponse(
             200,
             {accessToken,refreshToken},
             "Access token refreshed successfully"
         )
     )
   } catch (error) {

    throw new apiError(401,error?.message || "Invalid refresh token")
    
   }
})

const changeUserPassword = asyncHandler(async(req,res)=>{

    const {oldPassword,newPassword}=req.body;
    if(!oldPassword || !newPassword){
        throw new apiError(400,"All fields are required")
    }
    if(oldPassword===newPassword){
        throw new apiError(400,"New password must be different from old password")
    }

    const user =await User.findById(req.user._id)

    const isOldPasswordCorrect= await user.isPasswordCorrect(oldPassword)
    if(!isOldPasswordCorrect){
        throw new apiError(400,"Invalid old password")
    }

    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new apiResponse(200,{},"Password changed successfully")
    )
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new apiResponse(200,req.user,"current user has been fetched"))
})

const updateUserInfo = asyncHandler(async(req,res)=>{
    const {fullName,email}=req.body
    if(!fullName || !email){
        throw new apiError(400,"All fields are required")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {$set:{fullName,email}},
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new apiResponse(200,user,"User details updated successfuly"))
})

const getUserBorrowHistory = asyncHandler(async (req, res) => {
    const {page,limit}=req.query

    const{data:borrowHistory,metadata}= await paginate({
        model:Issue,
        query:{user:req.user._id,status:"RETURNED"},
        page,
        limit,
        populate:"book",
        sort:{returnDate:-1}
    })
    
    return res
        .status(200)
        .json(new apiResponse(200, { borrowHistory, metadata }, "History fetched"));
});

const getAllUsers = asyncHandler(async (req, res) => {
    const {page,limit}=req.query

    const {data:users,metadata}= await paginate({
        model:User,
        page,
        limit,
        select:"-password",
        sort:{createdAt:-1}
    })


    return res
        .status(200)
        .json(new apiResponse(200, { users, metadata }, "All users fetched successfully"));
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { userId, role } = req.body;
    if (!userId || !role) {
        throw new apiError(400, "User ID and role are required");
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { role: role.toUpperCase() } },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new apiResponse(200, updatedUser, "User role updated successfully"));
});
const forgetPassword=asyncHandler(async(req,res)=>{})

export { registerUser,loginUser,logoutUser,refreshAccessToken,changeUserPassword,getCurrentUser,updateUserInfo,getUserBorrowHistory,getAllUsers,updateUserRole,forgetPassword };