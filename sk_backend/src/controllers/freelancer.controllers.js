import { asyncHandler } from '../utils/AsyncHandler.js';
import { Freelancer } from '../models/freelancer.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const generateAccessAndRefreshToken = async (freelancerId) => {
    try{
        const freelancer = await Freelancer.findById(freelancerId);
        const accessToken = freelancer.generateAccessToken();
        const refreshToken = freelancer.generateRefreshToken();
        freelancer.refreshToken = refreshToken;
        await freelancer.save({validateBeforeSave: false});
        return {accessToken, refreshToken};

    }
    catch (error) {
        throw new ApiError(500, 'Error generating tokens');
    }
}

const registerFreelancer = asyncHandler(async (req,res) => {
    // req.body.dob = new Date(req.body.dob);
    const {
        email,
        username,
        password,
        fullname,
        dob,
        education,
        industry,
        phone,
    }= req.body;
    const alreadyExistsWithEmail =  await Freelancer.findOne({email});
    if(alreadyExistsWithEmail) {
        return res.status(400).json( new ApiResponse(400,null, "freelancer with email already exists"));
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // if(!avatarLocalPath){
    //     throw new ApiError(400, "Avatar file is required");
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalPath);
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // if(!avatar){
    //     throw new ApiError(400, "Avatar file is required");
    // }

    const freelancer = await Freelancer.create({
        email,
        username, 
        password,
        fullname, 
        dob, 
        education, 
        industry,  
        phone,
    });

    const createdFreelancer = await Freelancer.findById(freelancer._id).select(
        "-password -refreshToken"
    )

    if(!createdFreelancer){
        throw new ApiError(500, "something went wrong while registering freelancer.")
    }
    
    res
    .status(201)
    .json(new ApiResponse(201,{
        authenticated: true,
        freelancer,
    }, 'freelancer created successfully'));

    

})

const loginFreelancer = asyncHandler( async (req,res) => {
    const {username, password} = req.body;
    if(!username || !password) {
        throw new ApiError(400, 'All fields are required');
    }
    const freelancer = await Freelancer.findOne({ username : username });
    if(!freelancer) {
        return res.status(400).json(new ApiResponse(400, null, 'No such freelancer found'));
    }
    const isPasswordValid = await freelancer.isPasswordCorrect(password);
	if (!isPasswordValid) {
		return res.status(400).json(new ApiResponse(400, null, 'Invalid credentials'));
	}
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(freelancer._id);

    const loggedInFreelancer = await Freelancer.findById(freelancer._id).select('-password -refreshToken');

    const options = {   
        httpOnly: true, 
        secure: true
    };

    return res
	.status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
	.json(new ApiResponse(200, {
		authenticated: true,
		freelancer : loggedInFreelancer, accessToken, refreshToken
	}, 'Login successful'));

});

const logoutFreelancer = asyncHandler(async (req, res) => {
    Freelancer.findByIdAndUpdate(
        req.user._id, 
        {
            $set: {refreshToken: undefined}
        },
        {
            new: true

        }
    );
    const options = {   
        httpOnly: true, 
        secure: true
    };
    
    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, null, 'Logged out successfully'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, 'Unauthorized');
    }
   try {
     const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
     const freelancer = await Freelancer.findById(decodedToken?._id);
     if (!freelancer) {
         throw new ApiError(401, 'Unauthorized');
     }
     
     if (freelancer?.refreshToken !== incomingRefreshToken) {
         throw new ApiError(401, 'Refresh token is expired');
     }
 
     const options = {   
         httpOnly: true, 
         secure: true
     };
 
     const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(freelancer._id);
 
     return res
     .status(200)
     .cookie('accessToken', accessToken, options)
     .cookie('refreshToken', newRefreshToken, options)
     .json(new ApiResponse(200, {
         authenticated: true,accessToken,newRefreshToken},
          'Token refreshed successfully'
         )
     );
   } catch (error) {
     throw new ApiError(401, 'invalid refresh token');
   }

});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {currentPassword, newPassword} = req.body;
    const freelancer = await Freelancer.findById(req.user?._id).select('+password');
    const isPasswordValid = await freelancer.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
        throw new ApiError(400, 'Invalid current password');
    }
    freelancer.password = newPassword;
    await freelancer.save({validateBeforeSave: false});
    return res
    .status(200)
    .json(new ApiResponse(200, null, 'Password changed successfully'));
});

const getCurrentFreelancer = asyncHandler(async (req, res) => {
    const freelancer = await Freelancer.findById(req.user?._id).select('-password -refreshToken');
    return res
    .status(200)
    .json(new ApiResponse(200, {freelancer}, 'Freelancer details'));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {fullname, dob, education, industry, phone} = req.body;

    if(!fullname || !dob || !education || !industry || !phone){
        throw new ApiError(400, 'All fields are required');
    }

    const freelancer = await Freelancer.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {fullname, dob, education, industry, phone}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');
    return res
    .status(200)
    .json(new ApiResponse(200, {freelancer}, 'Account details updated successfully'));
});

// const updateFreelancerAvatar = asyncHandler(async (req, res) => {
//     const avatarLocalPath = req.file?.path;
//     if (!avatarLocalPath) {
//         throw new ApiError(400, 'Avatar file is missing');
//     }
//     const avatar = await uploadOnCloudinary(avatarLocalPath);

//     if (!avatar) {
//         throw new ApiError(400, 'error uploading avatar');
//     }

//     const freelancer = await Freelancer.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set: {avatar: avatar.url}
//         },
//         {
//             new: true
//         }
//     ).select('-password -refreshToken');
//     return res
//     .status(200)
//     .json(new ApiResponse(200, {freelancer}, 'Avatar updated successfully'));
// });

// const updateFreelancerCoverImage = asyncHandler(async (req, res) => {
//     const coverImageLocalPath = req.file?.path;
//     if (!coverImageLocalPath) {
//         throw new ApiError(400, 'Cover image file is missing');
//     }
//     const coverImage = await uploadOnCloudinary(coverImageLocalPath);

//     if (!coverImage) {
//         throw new ApiError(400, 'error uploading cover image');
//     }

//     const freelancer = await Freelancer.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set: {coverImage: coverImage.url}
//         },
//         {
//             new: true
//         }
//     ).select('-password -refreshToken');
//     return res
//     .status(200)
//     .json(new ApiResponse(200, {freelancer}, 'Cover image updated successfully'));
// });



export {
    registerFreelancer,
    loginFreelancer,
    logoutFreelancer,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentFreelancer,
    updateAccountDetails
    // updateFreelancerAvatar,
    // updateFreelancerCoverImage
}