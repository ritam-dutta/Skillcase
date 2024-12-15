import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const freelancerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        select: false,
    },
    username:{
        type: String,
        required: true,
    },
    fullname:{
        type: String,
        required:true,
    },
    dob:{
        type: Date,
        required: true,
    },
    education:{
        type: String,
        required: true,
    },
    industry:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    about:{
        type: String,
        required: false,
    },
    skills:{
        type: Array,
        required: false,
    },
    refreshToken:{
        type: String,
        required: false,
    }
}, { timestamps: true });

freelancerSchema.pre("save" ,async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

freelancerSchema.methods.isPasswordCorrect = async function (password) {
    const freelancer = await this.model('Freelancer').findById(this._id).select('+password');
    return await bcrypt.compare(password, freelancer.password);
}

freelancerSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
        role: "freelancer"
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { 
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
freelancerSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
    { 
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const Freelancer= mongoose.model("Freelancer", freelancerSchema);


