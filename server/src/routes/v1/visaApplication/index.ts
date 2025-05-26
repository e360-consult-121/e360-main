import { Router } from "express";
import clientSideRoutes from "./clientSideRoutes";
import adminSideRoutes from "./adminSideRoutes";
import commonRoutes from "./commonRoutes";
import docVaultRoutes from "./docVaultRoutes"
import chatRoutes from "./chatRoutes"
const router = Router();

router.use("/admin-side", adminSideRoutes);
router.use("/client-side" , clientSideRoutes);
router.use("/common" , commonRoutes);
router.use("/docVault" ,docVaultRoutes );
router.use("/chats" , chatRoutes );
export default router;