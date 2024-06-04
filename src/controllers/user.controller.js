import {asyncHandler} from '../middlewares/asyncHandler.js';


const registerUser = asyncHandler(async(res,req) => {
    res.status(200).json({
        message:"Register User"

    })
})


export default registerUser