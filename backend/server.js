import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";


const app=express();
const PORT=process.env.PORT||5001;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);


app.listen(PORT,()=>
{
    console.log(`\nserver is running on port ${PORT}\n`);
    connectMongoDB();
});