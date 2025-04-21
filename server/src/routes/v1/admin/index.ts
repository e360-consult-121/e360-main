import { Router } from "express";
import visaTypeRoutes from "./visaTypeRoutes";
import leadRoutes from "./leadRoutes";
import consultationRoutes from "./consultationRoutes";
import paymentRoutes from "./paymentRoutes";
// import jotformRoutes from "./jotformRoutes"
import dashboardRoutes from "./dashboardRoutes"
import visaApplicationRoutes from "./visaApplicationRoutes"

const router = Router();

router.use("/visaType", visaTypeRoutes);
router.use("/leads" , leadRoutes);
router.use("/consultations" , consultationRoutes);
router.use("/payment" , paymentRoutes);
router.use("/dashboard",dashboardRoutes)
router.use("/visaapplication",visaApplicationRoutes)
// router.use("/jotforms" , jotformRoutes);

export default router;