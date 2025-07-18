import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute=async (req,res,next)=>
{
    try
    {
        const token=req.cookies.jwt;
        if(!token)
        {
            return res.status(401).json({error:"Unauthorized - No token provided"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded)
        {
            return res.status(401).json({error:"Unauthorized - Invalid token"});
        }
        const user=await User.findById(decoded.userId).select("-password");
        if(!user)
        {
            return res.status(404).json({error:"User not found"});
        }
        req.user=user;
        next();
    }
    catch(error)
    {
        console.log(`\nError in protectRoute middleware ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}