import { asyncHandler } from '../utils/AsyncHandler.js';
import { Freelancer } from '../models/freelancer.models.js';
import { Client } from '../models/client.models.js';
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
        role,
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
        role,
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
    // console.log("logging in");
    const {username, password} = req.body;
    console.log(username, password);
    if(!username || !password) {
        throw new ApiError(400, 'All fields are required');
    }
    const freelancer = await Freelancer.findOne({ username : username });
    // console.log(freelancer);
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
    const freelancer = await Freelancer.findByIdAndUpdate(req.user?._id).select('+password');
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
    const {username} = req.params;
    const freelancer = await Freelancer.findOne({username}).select('-password -refreshToken');
    if (!freelancer) {
        throw new ApiError(404, 'Freelancer not found');
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {freelancer}, 'Freelancer details'));
});

const getLoggedInFreelancer = asyncHandler(async (req, res) => {
    // console.log("entered getLoggedInFreelancer");
    const freelancer = await Freelancer.findById(req.user?._id).select('-password -refreshToken');
    // console.log("loggedin freelancer",freelancer);
    if (!freelancer) {
        throw new ApiError(404, 'Freelancer not found');
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {freelancer}, 'Freelancer details'));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {fullname, dob, education, industry, phone,about,skills} = req.body;

    if(!fullname || !dob || !education || !industry){
        throw new ApiError(400, 'All fields are required');
    }

    const freelancer = await Freelancer.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {fullname, dob, education, industry, phone,about,skills}	
        },
        {
            new: true
        }
    ).select('-password -refreshToken');
    return res
    .status(200)
    .json(new ApiResponse(200, {freelancer}, 'Account details updated successfully'));
});

const updateFreelancerAvatar = asyncHandler(async (req, res) => {
    let avatarLocalPath = req.file?.path;
    // if (!avatarLocalPath) {
    //     avatarLocalPath = '../sk_frontend/public/images/user.png';
    // }
    // console.log(avatarLocalPath);
    if (!avatarLocalPath) {
        const freelancer = await Freelancer.findByIdAndUpdate(
            req._id,
            {
                $set: {avatar: null}
            },
            {
                new: true
            }
        ).select('-password -refreshToken');
        return res
        .status(200)
        .json(new ApiResponse(200, {freelancer}, 'Avatar updated successfully'));
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, 'error uploading avatar');
    }

    const freelancer = await Freelancer.findByIdAndUpdate(
        req._id,
        {
            $set: {avatar: avatar.secure_url}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');
    return res
    .status(200)
    .json(new ApiResponse(200, {freelancer}, 'Avatar updated successfully'));
});

const getFollowers = asyncHandler(async (req, res) => {
    const {username} = req.params;
    const freelancer = await Freelancer.findOne({username}).select('-password -refreshToken');
    if (!freelancer) {
        throw new ApiError(404, 'freelancer not found');
    }
    const followers = freelancer.followers;
    return res
    .status(200)
    .json(new ApiResponse(200, {followers}, 'Followers fetched successfully')); 

});

const followAccount = asyncHandler(async (req, res) => {
    const {username, followerRole} = req.body;
    // console.log("entered followAccount");
    let followingUser = {};
    if(followerRole === "freelancer") {
        followingUser = await Freelancer.findByIdAndUpdate(req.user?._id,
            {
                $addToSet: {following:{username: username, role: "freelancer"}}
            },
            {
                new: true
            }
        ).select('-password -refreshToken');
    }

    else if (followerRole === "client") {
        followingUser = await Client.findByIdAndUpdate(req.user?._id,
            {
                $addToSet: {following:{username: username, role: "freelancer"}}
            },
            {
                new: true
            }
        ).select('-password -refreshToken');
    }

    if (!followingUser) {
        throw new ApiError(404, `following ${followerRole} not found`);
    }
    // console.log("followingClient",followingClient);

    const followedFreelancer = await Freelancer.findOneAndUpdate({username},
        {
            $addToSet: {followers: {username: req.user?.username, role: followerRole}}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');

    if (!followedFreelancer) {
        throw new ApiError(404, 'followed Freelancer not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {followingUser, followedFreelancer}, 'Account followed successfully'));

});

const unFollowAccount = asyncHandler(async (req, res) => {
    // console.log("entered unfollowAccount");
    const {username, unFollowerRole} = req.body
    let unFollowingUser = {};
    if(unFollowerRole === "freelancer") {
        unFollowingUser = await Freelancer.findByIdAndUpdate(req.user?._id,
            {
                $pull: {following: {username: username, role: "freelancer"}}
            },
            {
                new: true
            }
        ).select('-password -refreshToken');
    }
    else if (unFollowerRole === "client") {
        unFollowingUser = await Client.findByIdAndUpdate(req.user?._id,
            {
                $pull: {following: {username: username, role: "freelancer"}}
            },
            {
                new: true
            }
        ).select('-password -refreshToken');
    }

    if (!unFollowingUser) {
        throw new ApiError(404, `unFollowing ${unFollowerRole} not found`);
    }

    const unFollowedFreelancer = await Freelancer.findOneAndUpdate({username},
        {
            $pull: {followers:{username: req.user?.username, role: unFollowerRole}}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');

    if (!unFollowedFreelancer) {
        throw new ApiError(404, 'unFollowed Freelancer not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {unFollowingUser, unFollowedFreelancer}, 'Account unfollowed successfully'));
});

const connectAccount = asyncHandler(async (req, res) => {
    const {username, connectorRole} = req.body;
    // console.log("entered followAccount");
    let connectedUser = {};
    const User = connectorRole === "freelancer" ? Freelancer : Client;
    
    connectedUser = await User.findOneAndUpdate({username},
        {
            $addToSet: {connections:{username: req.user?.username, role: "freelancer"}}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');

    if (!connectedUser) {
        throw new ApiError(404, `connecting ${connectorRole} not found`);
    }
    // console.log("connecting client",connectingClient);

    const connectedFreelancer = await Freelancer.findByIdAndUpdate(req.user?._id,
        {
            $addToSet: {connections:{username: username, role: connectorRole}}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');
    
    if (!connectedFreelancer) {
        throw new ApiError(404, 'connected Freelancer not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {connectedUser, connectedFreelancer}, 'Added to connections successfully'));

});

const disconnectAccount = asyncHandler(async (req, res) => {
    const {username, disConnectorRole} = req.body
    let disconnectingUser = {};

    if(disConnectorRole === "freelancer") {
        disconnectingUser = await Freelancer.findByIdAndUpdate(req.user?._id,
            {
                $pull: {connections:{username: username, role: "freelancer"}}
            },
            {
                new: true
            }
        ).select('-password -refreshToken');
    }
    else if (disConnectorRole === "client") {
        disconnectingUser = await Client.findByIdAndUpdate(req.user?._id,
            {
                $pull: {connections:{username: username, role: "freelancer"}}
            },
            {
                new: true
            }
        ).select('-password -refreshToken');
    }

    if (!disconnectingUser) {
        throw new ApiError(404, `disconnecting ${disConnectorRole} not found`);
    }

    const disconnectedFreelancer = await Freelancer.findOneAndUpdate({username},
        {
            $pull: {connections:{username: req.user?.username, role: disConnectorRole}}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');

    if (!disconnectedFreelancer) {
        throw new ApiError(404, 'disconnected Freelancer not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {disconnectingUser, disconnectedFreelancer}, 'Disconnected successfully'));
});

const getFollowings = asyncHandler(async (req, res) => {
    const {username} = req.params;
    const freelancer = await Freelancer.findOne({username}).select('-password -refreshToken');
    if (!freelancer) {
        throw new ApiError(404, 'freelancer not found');
    }
    const followings = freelancer.following;
    return res
    .status(200)
    .json(new ApiResponse(200, {followings}, 'followings fetched successfully')); 

});

const getConnections = asyncHandler(async (req, res) => {
    const {username} = req.params;
    const freelancer = await Freelancer.findOne({username}).select('-password -refreshToken');
    if (!freelancer) {
        throw new ApiError(404, 'freelancer not found');
    }
    const connections = freelancer.connections;
    return res
    .status(200)
    .json(new ApiResponse(200, {connections}, 'connections fetched successfully')); 

});

const createNotification = asyncHandler(async (req, res) => {
    const {notification} = req.body;
    const username = notification.receiver;
    const receiverRole = notification.receiverRole;
    let User = receiverRole === "freelancer" ? Freelancer : Client; 
    const user = await User.findOneAndUpdate({username},
        {
            $addToSet: {notifications: notification}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');
    if (!user) {
        throw new ApiError(404, `${User} not found`);
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {user}, 'Notification created successfully'));
});

const getNotifications = asyncHandler(async (req, res) => {
    const {username} = req.params;
    // const {role} = req.headers.role;
    // let User =  Freelancer; 
    const freelancer = await Freelancer.findOne({username}).select('-password -refreshToken');
    if (!freelancer) {
        throw new ApiError(404, `Freelancer not found`);
    }
    const notifications = freelancer.notifications;
    return res
    .status(200)
    .json(new ApiResponse(200, {notifications}, 'Notifications fetched successfully'));
});

const deleteNotification = asyncHandler(async (req, res) => {
    const {username, type} = req.body;
    const freelancer = await Freelancer.findOneAndUpdate(
        { username, 'notifications.type': type },
        {
            $pull: { notifications: { type } }
        },
        {
            new: true
        }
    ).select('-password -refreshToken');
    if (!freelancer) {
        throw new ApiError(404, 'Freelancer not found');
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {freelancer}, 'Notification deleted successfully'));
});

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
    getLoggedInFreelancer,
    updateAccountDetails,
    updateFreelancerAvatar,
    followAccount,
    unFollowAccount,
    connectAccount,
    disconnectAccount,
    getFollowers, 
    getFollowings,
    getConnections,
    createNotification,
    getNotifications,
    deleteNotification
    // updateFreelancerCoverImage
}