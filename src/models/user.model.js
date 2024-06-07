import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({

    username: {
        type : String ,
        required : true,
        unique : true,
        lowercase: true,
        trim: true,
        index: true
    },

    email:{
        type: String,
        required: true,
        unique: true ,
        lowercase : true,
        trim : true
    },
     
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type : String,
        required: true,
    },

    coverImage: {
        type: String, // cloudinary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }

    },
    { 
     timestamps: true
    }
  
  )

//   use of Pre middleware

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()

})

// use of instance method

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

//use of token expiration and it is also a method

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName

        },
        
        
            process.env.ACCESS_TOKEN_SECRET,

            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        
     )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName

        },
        
        
            process.env.REFRESH_TOKEN_SECRET,

            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        
     )
}

  export const User = mongoose.model("User", userSchema)