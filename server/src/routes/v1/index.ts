import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./user/index";
import adminRoutes from "./admin/index";

const router = express.Router();

router.use("/auth",authRoutes)
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);


export default router;
