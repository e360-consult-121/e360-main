import { Router } from "express";
import clientSideRoutes from "./clientSideRoutes";
import adminSideRoutes from "./adminSideRoutes";
import commonRoutes from "./commonRoutes";

const router = Router();

router.use("/admin-side", adminSideRoutes);
router.use("/client-side" , clientSideRoutes);
router.use("/common" , commonRoutes);

export default router;