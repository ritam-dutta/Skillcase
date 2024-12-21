import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Freelancer } from "../models/freelancer.models.js";
import { Client } from "../models/client.models.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        let token =req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken
        token = token.slice(1,token.length-1)    
        // console.log(token)
        if(!token) {
           throw new ApiError(401, 'Unauthorized');
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const role = decodedToken?.role;
        if(role === 'freelancer'){
            const freelancer = await Freelancer.findById(decodedToken?._id).select('-password -refreshToken');
            if(!freelancer){
                throw new ApiError(401, 'Invalid access token');
            }
            req.user = freelancer;
            next();
        }

        else if(role === 'client'){
            const client = await Client.findById(decodedToken?._id).select('-password -refreshToken');
            if(!client){
                throw new ApiError(401, 'Invalid access token');
            }
            req.user = client;
            next();
        }
        
    
    } catch (error) {
        throw new ApiError(401, 'Unauthorized');
        
    }

})

// export const verifyJWTFreelancer = asyncHandler(async (req, _, next) => {
//     try {
//         let token =req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken
//         token = token.slice(1,token.length-1)    
//         // console.log(token)
//         if(!token) {
//            throw new ApiError(401, 'Unauthorized');
//         }
    
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         const role = decodedToken?.role;
//         const freelancer = await Freelancer.findById(decodedToken?._id).select('-password -refreshToken');
//         if(!freelancer){
//             throw new ApiError(401, 'Invalid access token');
//         }
//         req.user = freelancer;
//         next();
    
//     } catch (error) {
//         throw new ApiError(401, 'Unauthorized');
        
//     }

// })

// export const verifyJWTClient = asyncHandler(async (req, _, next) => {
//     try {
//         let token =req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken
//         token = token.slice(1,token.length-1)    
//         // console.log(token)
//         if(!token) {
//            throw new ApiError(401, 'Unauthorized');
//         }
    
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         const role = decodedToken?.role;
    
//         const client = await Client.findById(decodedToken?._id).select('-password -refreshToken');
//         // console.log(client)
//         if(!client){
//             throw new ApiError(401, 'Invalid access token');
//         }
//         req.user = client;
//         next();
    
//     } catch (error) {
//         throw new ApiError(401, 'Unauthorized');
        
//     }

// })