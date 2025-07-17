import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const createPost=async (req,res)=>
{
    try
    {
        const {text}=req.body;
        let {img}=req.body;
        const userId=req.user._id.toString();
        const user=await User.findById(userId);
        if(!user)
        {
            return res.status(404).json({error:"User not found"});
        }
        if(!text&&!img)
        {
            return res.status(400).json({error:"Please provide text or image"});
        }
        if(img)
        {
            const uploaderResponse=await cloudinary.uploader.upload(img);
            img=uploaderResponse.secure_url;
        }
        const newPost=new Post(
            {
                user:userId,
                text,
                img,
            }
        );
        await newPost.save();
        res.status(201).json(newPost);
    }
    catch(error)
    {
        console.log(`\nError in createPost controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const deletePost=async (req,res)=>
{
    try
    {
        const post=await Post.findById(req.params.id);
        if(!post)
        {
            return res.status(404).json({error:"Post not found"});
        }
        if(post.user.toString()!==req.user._id.toString())
        {
            return res.status(401).json({error:"You are not authorized to delete this post"});
        }
        if(post.img)
        {
            const imgId=post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Post deleted successfully"});
    }
    catch(error)
    {
        console.log(`\nError in deletePost controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const commentOnPost=async (req,res)=>
{
    try
    {
        const {text}=req.body;
        const postId=req.params.id;
        const userId=req.user._id;
        if(!text)
        {
            return res.status(400).json({error:"Please provide text"});
        }
        const post=await Post.findById(postId);
        if(!post)
        {
            return res.status(404).json({error:"Post not found"});
        }
        const comment=
        {
            user:userId,
            text,
        };
        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);
    }
    catch(error)
    {
        console.log(`\nError in commentOnPost controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const likeUnlikePost=async (req,res)=>
{
    try
    {
        const userId=req.user._id;
        const postId=req.params.id;
        const post=await Post.findById(postId);
        if(!post)
        {
            return res.status(404).json({error:"Post not found"});
        }
        const userLikedPost=post.likes.includes(userId);
        if(userLikedPost)
        {
            await Post.findByIdAndUpdate(postId,
                {
                    $pull:{likes:userId}
                }
            );
            await User.findByIdAndUpdate(userId,
                {
                    $pull:{likedPosts:postId}
                }
            );
            res.status(200).json({message:"Post unliked successfully"});
        }
        else
        {
            await Post.findByIdAndUpdate(postId,
                {
                    $push:{likes:userId}
                }
            );
            await User.findByIdAndUpdate(userId,
                {
                    $push:{likedPosts:postId}
                }
            );
            const notification=new Notification(
                {
                    from:userId,
                    to:post.user,
                    type:"like",
                }
            )
            await notification.save();
            res.status(200).json({message:"Post liked successfully"});
        }
    }
    catch(error)
    {
        console.log(`\nError in likeUnlikePost controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const getAllPosts=async (req,res)=>
{
    try
    {
        const posts=await Post.find().sort({createdAt:-1}).populate(
            {
                path:"user",
                select:"-password",
            }
        ).populate(
            {
                path:"comments.user",
                select:"-password",
            }
        );
        if(posts.length===0)
        {
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    }
    catch(error)
    {
        console.log(`\nError in getAllPosts controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const getLikedPosts=async (req,res)=>
{
    try
    {
        const userId=req.params.id;
        const user=await User.findById(userId);
        if(!user)
        {
            return res.status(404).json({error:"User not found"});
        }
        const likedPosts=await Post.find({_id:{$in:user.likedPosts}}).populate(
            {
                path:"user",
                select:"-password",
            }
        ).populate(
            {
                path:"comments.user",
                select:"-password",
            }
        );
        if(likedPosts.length===0)
        {
            return res.status(200).json([]);
        }
        res.status(200).json(likedPosts);
    }
    catch(error)
    {
        console.log(`\nError in getLikedPosts controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}