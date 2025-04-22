import { Router } from "express";
import clientSideRoutes from "./clientSideRoutes";
import adminSideRoutes from "./adminSideRoutes";


const router = Router();

router.use("/admin-side", adminSideRoutes);
router.use("/client-side" , clientSideRoutes);


export default router;