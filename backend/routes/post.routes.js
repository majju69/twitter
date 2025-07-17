import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { commentOnPost, createPost, deletePost, getAllPosts, getLikedPosts, likeUnlikePost } from "../controllers/post.controller.js";

const router=express.Router();

router.use(protectRoute);

router.get("/all",getAllPosts);
router.get("/likes/:id",getLikedPosts);
router.post("/create",createPost);
router.post("/like/:id",likeUnlikePost);
router.post("/comment/:id",commentOnPost);
router.delete("/:id",deletePost);

export default router;