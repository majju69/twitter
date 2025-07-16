import User from "../models/user.model.js";

export const getUserProfile=async (req,res)=>
{
    try
    {
        const {username}=req.params;
        const user=await User.findOne({username}).select("-password");
        if(!user)
        {
            return res.status(404).json({error:"User not found"});
        }
        res.status(200).json(user);
    }
    catch(error)
    {
        console.log(`\nError in getUserProfile controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const followUnfollowUser=async (req,res)=>
{
    try
    {
        const {id}=req.params;
        const userToModify=await User.findById(id);
        const currentUser=await User.findById(req.user._id);
        if(id===req.user._id.toString())
        {
            return res.status(400).json({error:"You cannot follow/unfollow yourself"});
        }
        if(!userToModify||!currentUser)
        {
            return res.status(404).json({error:"User not found"});
        }
        const isFollowing=currentUser.following.includes(id);
        if(isFollowing)
        {
            await User.findByIdAndUpdate(id,
                {
                    $pull:{followers:req.user._id}
                }
            );
            await User.findByIdAndUpdate(req.user._id,
                {
                    $pull:{following:id}
                }
            );
            res.status(200).json({message:"Unfollow successful"});
        }
        else
        {
            await User.findByIdAndUpdate(id,
                {
                    $push:{followers:req.user._id}
                }
            );
            await User.findByIdAndUpdate(req.user._id,
                {
                    $push:{following:id}
                }
            );
            res.status(200).json({message:"Follow successful"});
        }
    }
    catch(error)
    {
        console.log(`\nError in followUnfollowUser controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}