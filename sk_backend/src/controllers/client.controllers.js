import { asyncHandler } from '../utils/AsyncHandler.js';
import { Client } from '../models/client.models.js';
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
    console.log("entered getCurrentClient");
    const {username} = req.params;
    const client = await Client.findOne({username}).select('-password -refreshToken');
    return res
    .status(200)
    .json(new ApiResponse(200, {client}, 'Client details'));
});

const getLoggedInClient = asyncHandler(async (req, res) => {
    console.log("entered getLoggedInClient");
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
    }= req.body;

    if(!fullname || !dob || !industry || !phone){
        throw new ApiError(400, 'All fields are required');
    }

    const client = await Client.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {fullname, dob, companyname, industry, department, phone}
        },
        {
            new: true
        }
    ).select('-password -refreshToken');
    return res
    .status(200)
    .json(new ApiResponse(200, {client}, 'Account details updated successfully'));
});

export {
    registerClient,
    loginClient,
    logoutClient,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentClient,
    getLoggedInClient,
    updateAccountDetails
}