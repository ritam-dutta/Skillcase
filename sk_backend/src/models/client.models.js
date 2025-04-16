import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const clientSchema = new mongoose.Schema({
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
        unique: true,
    },
    fullname:{
        type: String,
        required:true,
    },
    dob:{
        type:Date,
        required: true,
    },
    companyname:{
        type: String,
        required: false,
    },
    department:{
        type: String,
        required: false,
    },
    industry:{
        type: String,
        required: false,
    },
    phone:{
        type: String,
        required: true,
    },
    about:{
        type: String,
        required: false,
    },
    experience:{
        type: String,
        required: false,
    },
    avatar:{
        type: String || null,
        required: false,
    },
    role:{
        type: String,
        required: true,
    },
    followers:{
        type: Array,
        required: false,
    },
    following:{
        type: Array,
        required: false,
    },
    connections:{
        type: Array,
        required: false,
    },
    notifications:{
        type: Array,
        required: false,
    },
    collaborations:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Project",
        required: false,
    },
    requestedCollabs:{
        type: [
            {
                client:{
                    type: String,
                    required: true,
                },
                projectId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Project",
                    required: true,
                }
            }
        ],
            required: false,
    },
    projects:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Project",
        required: false,
    },
    savedProjects:{ 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Project",
        required: false,
    },
    likedProjects:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Project",
        required: false,
    },
    refreshToken:{
        type: String,
        required: false,
    }
}, { timestamps: true });

clientSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

clientSchema.methods.isPasswordCorrect = async function (password) {
    const client = await mongoose.model("Client").findById(this._id).select('+password');
    return await bcrypt.compare(password, client.password);
}

clientSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
        role: "client"
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { 
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
clientSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
    { 
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const Client= mongoose.model("Client", clientSchema);


