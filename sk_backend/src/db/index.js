import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv"
// dotenv.config({
//     path:'./env'
// });

const connectDB = async () => {
    console.log(DB_NAME,process.env.MONGODB_URI)
    try{
        const connectionInstance = await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MONGODB connected!! DB HOST: ${connectionInstance.connection.host}`);

    }catch(error){
        console.log("MONGODB connection FAILED", error);
        process.exit(1)
    }
}   
export default connectDB