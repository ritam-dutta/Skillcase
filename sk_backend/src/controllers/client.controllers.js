import { asyncHandler } from '../utils/AsyncHandler.js';
import { Client } from '../models/client.models.js';
import { Freelancer } from '../models/freelancer.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken = async (clientId) => {
    try{
        const client = await Client.findById(clientId);
        const accessToken = client.generateAccessToken();
        const refreshToken = client.generateRefreshToken();
        client.refreshToken = refreshToken;
        await client.save({validateBeforeSave: false});
        return {accessToken, refreshToken};

    }
    catch (error) {
        throw new ApiError(500, 'Error generating tokens');
    }
}

const registerClient = asyncHandler(async (req,res) => {
    // console.log("registering");
    const {
        email,
        username,
        password,
        fullname,
        dob,
        companyname,
        industry,
        department,
        phone,
        role,
    }= req.body;
    // console.log("registering2");
    const alreadyExistsWithEmail =  await Client.findOne({email});
    // console.log(alreadyExistsWithEmail);
    if(alreadyExistsWithEmail) {
        return res.status(400).json( new ApiResponse(400,null, "Client with email already exists"));
    }
    const client = await Client.create({
        email,
        username, 
        password, 
        fullname, 
        dob, 
        companyname, 
        industry, 
        department, 
        phone,
        role,
    });

    const createdClient = await Client.findById(client._id).select(
        "-password -refreshToken"
    )

    if(!createdClient){
        throw new ApiError(500, "something went wrong while registering client.")
    }

    // const createdClient = await Client.findById().select('-password');
    res
    .status(201)
    .json(new ApiResponse(201,{
        authenticated: true,
        client,
    }, 'client created successfully'));

})

const loginClient = asyncHandler( async (req,res) => {
    console.log("entered login")
    const {username, password} = req.body;
    if(!username || !password) {
        throw new ApiError(400, 'All fields are required');
    }
    const client = await Client.findOne({ username : username });
    if(!client) {
        return res.status(400).json(new ApiResponse(400, null, 'No such client found'));
    }
    const isPasswordValid = await client.isPasswordCorrect(password);
	if (!isPasswordValid) {
		return res.status(400).json(new ApiResponse(400, null, 'Invalid credentials'));
	}

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(client._id);

    const loggedInClient = await Client.findById(client._id).select('-password -refreshToken');

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
		client : loggedInClient, accessToken, refreshToken
	}, 'Login successful'));

});

const logoutClient = asyncHandler(async (req, res) => {
    Client.findByIdAndUpdate(
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
        const client = await Client.findById(decodedToken?._id);
        if (!client) {
            throw new ApiError(401, 'Unauthorized');
        }
        
        if (client?.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, 'Refresh token is expired');
        }
    
        const options = {   
            httpOnly: true, 
            secure: true
        };
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(client._id);
    
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
    const client = await Client.findById(req.user?._id).select('+password');
    const isPasswordValid = await client.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
        throw new ApiError(400, 'Invalid current password');
    }
    client.password = newPassword;
    await client.save({validateBeforeSave: false});
    return res
    .status(200)
    .json(new ApiResponse(200, null, 'Password changed successfully'));
});

const getCurrentClient = asyncHandler(async (req, res) => {
    // console.log("entered getCurrentClient");
    const {username} = req.params;
    const client = await Client.findOne({username}).select('-password -refreshToken');
    return res
    .status(200)
    .json(new ApiResponse(200, {client}, 'Client details'));
});

const getLoggedInClient = asyncHandler(async (req, res) => {
    // console.log("entered getLoggedInClient");
    const client = await Client.findById(req.user?._id).select('-password -refreshToken');
    if (!client) {
        throw new ApiError(404, 'Client not found');
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {client}, 'Client details'));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {
        fullname,
        dob,
        companyname,
        industry,
        department,
        phone,
        about,
    }= req.body;

    if(!fullname || !dob || !industry || !phone){
        throw new ApiError(400, 'All fields are required');
    }

    const client = await Client.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {fullname, dob, companyname, industry, department, phone, about}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');
    return res
    .status(200)
    .json(new ApiResponse(200, {client}, 'Account details updated successfully'));
});

const followAccount = asyncHandler(async (req, res) => {
    const {username, followerRole} = req.body;
    // console.log("entered followAccount");
    let followingUser = {};
    if(followerRole === "freelancer") {
        followingUser = await Freelancer.findByIdAndUpdate(req.user?._id,
            {
                $addToSet: {following:{username: username, role: "client"}}
            },
            {
                new: true
            }
        ).select('-password -refreshToken');
    }

    else if (followerRole === "client") {
        followingUser = await Client.findByIdAndUpdate(req.user?._id,
            {
                $addToSet: {following:{username: username, role: "client"}}
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

    const followedClient = await Client.findOneAndUpdate({username},
        {
            $addToSet: {followers: {username: req.user?.username, role: followerRole}}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');

    if (!followedClient) {
        throw new ApiError(404, 'followed User not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {followingUser, followedClient}, 'Account followed successfully'));

});

const unFollowAccount = asyncHandler(async (req, res) => {
    // console.log("entered unfollowAccount");
    const {username, unFollowerRole} = req.body
    let unFollowingUser = {};
    if(unFollowerRole === "freelancer") {
        unFollowingUser = await Freelancer.findByIdAndUpdate(req.user?._id,
            {
                $pull: {following: {username: username, role: "client"}}
            },
            {
                new: true
            }
        ).select('-password -refreshToken');
    }
    else if (unFollowerRole === "client") {
        unFollowingUser = await Client.findByIdAndUpdate(req.user?._id,
            {
                $pull: {following: {username: username, role: "client"}}
            },
            {
                new: true
            }
        ).select('-password -refreshToken');
    }

    if (!unFollowingUser) {
        throw new ApiError(404, `unFollowing ${unFollowerRole} not found`);
    }

    const unFollowedClient = await Client.findOneAndUpdate({username},
        {
            $pull: {followers:{username: req.user?.username, role: unFollowerRole}}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');

    if (!unFollowedClient) {
        throw new ApiError(404, 'unFollowed User not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {unFollowingUser, unFollowedClient}, 'Account unfollowed successfully'));
});

const connectAccount = asyncHandler(async (req, res) => {
    const {username, connectorRole} = req.body;
    console.log(username, connectorRole);   
    // console.log("entered connect");
    let connectedUser = {};
    const User = connectorRole === "freelancer" ? Freelancer : Client;

    connectedUser = await User.findOneAndUpdate({username},
        {
            $addToSet: {connections:{username: req.user?.username, role: "client"}}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');


    if (!connectedUser) {
        throw new ApiError(404, `connecting ${connectorRole} not found`);
    }
    console.log("connecting client");

    const connectedClient = await Client.findByIdAndUpdate(req.user?._id,
        {
            $addToSet: {connections:{username: username, role: connectorRole}}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');
    
    if (!connectedClient) {
        throw new ApiError(404, 'connected Client not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {connectedUser, connectedClient}, 'Added to connections successfully'));

});

const disconnectAccount = asyncHandler(async (req, res) => {
    const {username, disConnectorRole} = req.body
    let disconnectingUser = {};

    if(disConnectorRole === "freelancer") {
        disconnectingUser = await Freelancer.findByIdAndUpdate(req.user?._id,
            {
                $pull: {connections:{username: username, role: "client"}}
            },
            {
                new: true
            }
        ).select('-password -refreshToken');
    }
    else if (disConnectorRole === "client") {
        disconnectingUser = await Client.findByIdAndUpdate(req.user?._id,
            {
                $pull: {connections:{username: username, role: "client"}}
            },
            {
                new: true
            }
        ).select('-password -refreshToken');
    }

    if (!disconnectingUser) {
        throw new ApiError(404, `disconnecting ${disConnectorRole} not found`);
    }

    const disconnectedClient = await Client.findOneAndUpdate({username},
        {
            $pull: {connections:{username: req.user?.username, role: disConnectorRole}}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');

    if (!disconnectedClient) {
        throw new ApiError(404, 'disconnected Client not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {disconnectingUser, disconnectedClient}, 'Disconnected successfully'));
});

const getFollowers = asyncHandler(async (req, res) => {
    const {username} = req.params;
    // const role = req.headers.role;
    const client = await Client.findOne({username}).select('-password -refreshToken');
    if (!client) {
        throw new ApiError(404, 'Client not found');
    }
    const followers = client.followers;
    return res
    .status(200)
    .json(new ApiResponse(200, {followers}, 'Followers fetched successfully')); 

});

const getFollowings = asyncHandler(async (req, res) => {
    const {username} = req.params;
    const client = await Client.findOne({username}).select('-password -refreshToken');
    if (!client) {
        throw new ApiError(404, 'Client not found');
    }
    const followings = client.following;
    return res
    .status(200)
    .json(new ApiResponse(200, {followings}, 'followings fetched successfully')); 

});

const getConnections = asyncHandler(async (req, res) => {
    const {username} = req.params;
    const client = await Client.findOne({username}).select('-password -refreshToken');
    if (!client) {
        throw new ApiError(404, 'Client not found');
    }
    const connections = client.connections;
    return res
    .status(200)
    .json(new ApiResponse(200, {connections}, 'connections fetched successfully')); 

});

const createNotification = asyncHandler(async (req, res) => {
    const {notification} = req.body;
    const receiverRole = notification.receiverRole;
    const username = notification.receiver;
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
    const client = await Client.findOne({username}).select('-password -refreshToken');
    if (!client) {
        throw new ApiError(404, `Client not found`);
    }
    const notifications = client.notifications;
    return res
    .status(200)
    .json(new ApiResponse(200, {notifications}, 'Notifications fetched successfully'));
});

const deleteNotification = asyncHandler(async (req, res) => {
    // console.log("entered deleteNotification");
    const {username, type} = req.body;
    // console.log(username)
    
    const client = await Client.findOneAndUpdate(
        { username },
        {
            $pull: { notifications: { type } }
        },
        {
            new: true
        }
    ).select('-password -refreshToken');
    if (!client) {
        throw new ApiError(404, 'Client not found');
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {client}, 'Notification deleted successfully'));
});

export {
    registerClient,
    loginClient,
    logoutClient,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentClient,
    getLoggedInClient,
    updateAccountDetails,
    followAccount,
    unFollowAccount,
    connectAccount,
    disconnectAccount,
    getFollowers,
    getFollowings,
    getConnections,
    createNotification,
    getNotifications,
    deleteNotification,
}