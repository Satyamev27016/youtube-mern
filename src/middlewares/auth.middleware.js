import ApiError from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async(req, res, next) => {
    // 1.
   try {
     const accessToken = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "")
 
     if(!accessToken){
        throw new ApiError(401, "Unauthorized request")
     }
 
     const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
 
    const user = await user.findById(decodedToken?._id).select("-password -refreshToken")
 
    if(!user){
     throw new ApiError(401, "invalid Access Token")
    }
 
     req.user = user;
     next()
   } catch (error) {
    throw new ApiError(401, " something went wrong ")
   }
})