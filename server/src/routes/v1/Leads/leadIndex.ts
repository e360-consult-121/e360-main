import { Router } from "express";
import leadRoutes from "./leadRoutes";

const router = Router();

router.use("/leads", leadRoutes);


export default router;