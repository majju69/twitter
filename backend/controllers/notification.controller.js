import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications=async (req,res)=>
{
    try
    {
        const userId=req.user._id;
        const user=await User.findById(userId);
        if(!user)
        {
            return res.status(404).json({error:"User not found"});
        }
        const notifications=await Notification.find({to:userId}).populate(
            {
                path:"from",
                select:"username profileImg",
            }
        );
        await Notification.updateMany({to:userId},{read:true}); // may give errors
        res.status(200).json(notifications);
    }
    catch(error)
    {
        console.log(`\nError in getNotifications controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const deleteNotifications=async (req,res)=>
{
    try
    {
        const userId=req.user._id;
        const user=User.findById(userId);
        if(!user)
        {
            return res.status(404).json({error:"User not found"});
        }
        await Notification.deleteMany({to:userId});
        res.status(200).json({message:"Notifications deleted successfully"});
    }
    catch(error)
    {
        console.log(`\nError in deleteNotifications controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}