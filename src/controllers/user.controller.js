import {asyncHandler} from '../utils/asyncHandler.js';


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
})


export  {registerUser};