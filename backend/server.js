import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import { v2 as cloudinary } from "cloudinary";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import path from "path";

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
);

const app=express();
const PORT=process.env.PORT||5001;
const __dirname=path.resolve();

app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/notifications",notificationRoutes);

// if(process.env.NODE_ENV==="production")
// {
//     app.use(express.static(path.join(__dirname,"/frontend/dist")));
//     app.get("*",(req,res)=>
//     {
//         res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
//     });
// }

if(process.env.NODE_ENV==="production")
{
    app.use(express.static(path.join(__dirname,"/frontend/dist")));
    app.get('/{*any}',(req,res)=>
    {
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
    });
}


app.listen(PORT,()=>
{
    console.log(`\nserver is running on port ${PORT}\n`);
    connectMongoDB();
});