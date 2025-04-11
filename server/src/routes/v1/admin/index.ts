import { Router } from "express";
import visaTypeRoutes from "./visaTypeRoutes";
import leadRoutes from "./leadRoutes";
import consultationRoutes from "./consultationRoutes";
import paymentRoutes from "./paymentRoutes";
const router = Router();

router.use("/visaType", visaTypeRoutes);
router.use("/leads" , leadRoutes);
router.use("/consultations" , consultationRoutes);
router.use("/payment" , paymentRoutes);

export default router;