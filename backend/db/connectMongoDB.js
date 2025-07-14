import mongoose from "mongoose";

const connectMongoDB=async ()=>
{
    try
    {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`\nConnected to MongoDB ${conn.connection.host}\n`);
    }
    catch(error)
    {
        console.log(`\nError in connecting to MongoDB ${error}\n`);
        process.exit(1);
    }
};

export default connectMongoDB;