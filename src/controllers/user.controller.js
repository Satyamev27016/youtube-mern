import {asyncHandler} from '../utils/asyncHandler.js';
import ApiError from "../utils/apiError.js" 
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from '../utils/cloudnary.js';
import {ApiResponse} from '../utils/apiResponse.js';


// 5.
const generateAccessAndRefreshToken = async(userId) =>{
   try{
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validataBeforeSave: false })

    return {accessToken, refreshToken}
   } catch(error){
      throw new ApiError(500, "Token generation failed")
   }
}

const registerUser = asyncHandler(async(req ,res) => {
   //get user detail from frontend 
   // validate user input - non empty 
   //check if user already exit : username , email
   // check for image , check for avtar 
   //upload them to cloudinary, avtar 
   // create user object - create entry in db 
   //remove password and refresh token field from response
   //check for user creation 
   //return response
  
   // function for validation of email

   function isValidation(email) {
      const emailRe = /\S+@\S+\.\S+/;
      return emailRe.test(email);
   }

  const {fullName, username, email, password} = req.body;
  //console.log("email : ", email);

  if([fullName, username, email, password ].some((field) => field?.trim() === "")
   
) {
    throw new ApiError(400, "All field are required") 
  }

  if(!isValidation(email)){
      throw new ApiError(400, "Invalid email format")
  }
    
  // check if user already exit : username , email
   const exitedUser = await User.findOne({
         $or: [{username}, {email}]
      
   })

   if(exitedUser){
      throw new ApiError (409, "username or email already taken")
   }

   console.log("req.files : ", req.files);
  // check for image , check for avtar  multer give the file
   const avatarLocalPath = req.files?.avatar[0]?.path;
   if(!avatarLocalPath){
      throw new ApiError(400, "Avatar is required")
   }

   let coverImageLocalPath;   
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
      coverImageLocalPath = req.files.coverImage[0].path;
   }
     
   //upload them to cloudinary, avtar and coverImage
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage =  await uploadOnCloudinary(coverImageLocalPath) ;
   
   if(!avatar){
      throw new ApiError(400, "Avatar file upload failed")
   }

   // create user object - create entry in db

   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username : username.toLowerCase()
   })

   const createdUser = await User.findById(user._id).select("-password  -refreshToken")
   
   if(!createdUser){
      throw new ApiError(500, "User creation failed")
   }

   return res.status(201).json(
      new ApiResponse(201, createdUser, "User created successfully"))
})
 
const loginUser  = asyncHandler(async(req, res)=>{
    // rea body -> data 
    //username and email check if it is given 
    //find the user
    // password check
    // access and refresh token generation
    // send cookie 
    // 1.
   const {username, email, password}= req.body
    console.log(email)
    
    // 2.
   if(!username && !email){
      throw new ApiError(400, "username or email is required")
    }
   
    // 3.
   const user = await User.findOne({
         $or: [{username}, {email}]
    })

   if(!user){
      throw new ApiError(404,"user not found ")
   }
  
   // 4.
   const isPasswordValid = await user.isPasswordValid(password)

   if(!isPasswordValid){
      throw  new ApiError(401," invalid password")
   }

   // 5.

   const{accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const option ={
      httpOnly: true,
      secure: true
   }

   return res 
   .status(200)
   .cookie("accessToken", accessToken, option)
   .cookie("refreshToken", refreshToken, option)
   .json(
      new ApiResponse(
         200,
         {
            user: loggedInUser, accessToken, refreshToken
         },"User logged in successfully"
      )
   )
})

const logoutUser = asyncHandler(async(req, res) => {
     await  User.findByIdAndUpdate(
         req.user._id,
         {
            $set:{
               refreshToken: undefined
            }
         },
         {
            new: true
         },
         
      
      )
      
   // cookie 

   const options ={
      httpOnly:true,
      secure: true
   }

      return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged Out"))

})

export  {
   registerUser,
   loginUser,
   logoutUser
};