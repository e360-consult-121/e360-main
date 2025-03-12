import { Router } from "express";
import visaTypeRoutes from "./visaTypeRoutes";

const router = Router();

router.use("/visaType", visaTypeRoutes);


export default router;