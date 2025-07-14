import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";

const PORT=process.env.PORT||5001;

const app=express();

app.use("/api/auth",authRoutes);


app.listen(PORT,()=>
{
    console.log(`\nserver is running on port ${PORT}\n`);
    connectMongoDB();
});