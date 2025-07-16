import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { followUnfollowUser, getUserProfile } from "../controllers/user.controller.js";

const router=express.Router();

router.use(protectRoute);

router.get("/profile/:username",getUserProfile);
// router.get("/suggested");
router.post("/follow/:id",followUnfollowUser);
// router.post("/update");

export default router;