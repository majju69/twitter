import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup=async(req,res)=>
{
    try
    {
        // console.log(req.body);
        const {fullName,username,email,password}=req.body;
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email))
        {
            return res.status(400).json({error:"Invalid Email Format"});
        }
        // console.log(username)
        const existingUser=await User.findOne({username});
        // console.log(existingUser)
        if(existingUser)
        {
            return res.status(400).json({error:"Username already taken"});
        }
        const existingEmail=await User.findOne({email});
        // console.log(existingEmail)
        if(existingEmail)
        {
            return res.status(400).json({error:"Email already taken"});
        }
        if(password.length<6)
        {
            return res.status(400).json({error:"Password must be at least 6 characters"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({fullName,username,email,password:hashedPassword});
        if(newUser)
        {
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
            res.status(201).json(
                {
                    _id:newUser._id,
                    fullName:newUser.fullName,
                    username:newUser.username,
                    email:newUser.email,
                    followers:newUser.followers,
                    following:newUser.following,
                    profileImg:newUser.profileImg,
                    coverImg:newUser.coverImg
                }
            );
        }
        else
        {
            res.status(400).json({error:"Invalid User Data"});
        }
    }
    catch(error)
    {
        console.log(`\nError in signup controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const login=async(req,res)=>
{
    try
    {
        const {username,password}=req.body;
        const user=await User.findOne({username});
        const isPasswordCorrect=await bcrypt.compare(password,user?.password||"");
        if(!user||!isPasswordCorrect)
        {
            return res.status(400).json({error:"Invalid username or password"});
        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json(
            {
                _id:user._id,
                fullName:user.fullName,
                username:user.username,
                email:user.email,
                followers:user.followers,
                following:user.following,
                profileImg:user.profileImg,
                coverImg:user.coverImg
            }
        );
    }
    catch(error)
    {
        console.log(`\nError in login controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const logout=async(req,res)=>
{
    try
    {
        res.cookie("jwt","",
            {
                maxAge:0,
            }
        );
        res.status(200).json({message:"Logout successful"});
    }
    catch(error)
    {
        console.log(`\nError in logout controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const getMe=async (req,res)=>
{
    try
    {
        const user=await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    }
    catch(error)
    {
        console.log(`\nError in getMe controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}