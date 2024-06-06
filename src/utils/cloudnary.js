import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath)  return null
           
            
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })

            console.log("file uploaded succesfully ", response.url);
            return response;
        }  catch(err){
            fs.unlinkSync(localFilePath); // delete the file temporarily stored on server
            return null;
        }
    }
