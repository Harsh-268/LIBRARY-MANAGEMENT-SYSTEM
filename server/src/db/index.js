import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB=async()=>{
try {
    if(!process.env.MONGODB_URI){
        throw new Error("MONGODB_URI is not defined in environment variables")
    }
    const connecionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

    console.log(`\nMongoDB connected, DB host->${connecionInstance.connection.host}`)
} catch (error) {
    console.log("MongoDB connection error",error)
    process.exit(1)
}
}

export default connectDB;
 