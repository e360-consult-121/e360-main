import { Router } from "express";
// import visaTypeRoutes from "./visaTypeRoutes";
import leadRoutes from "./leadRoutes";
import consultationRoutes from "./consultationRoutes";
import paymentRoutes from "./paymentRoutes";
// import jotformRoutes from "./jotformRoutes"
import dashboardRoutes from "./dashboardRoutes"
import visaApplicationRoutes from "./visaApplicationRoutes"
import bankdetailsRoutes from "./bankdetailsRoutes"
import clientsInfoRoutes from "./clientsInfoRoutes"
import adminControlRoutes from "./adminControlRoutes"
import rbacRoutes from "./RBACroutes"
import taskRoutes from "./taskRoutes";
// import migrationRoutes from "./migrationRoutes";
import logRoutes from "./logRoutes";
const router = Router();

// router.use("/visaType", visaTypeRoutes);
router.use("/leads" , leadRoutes);
router.use("/consultations" , consultationRoutes);
router.use("/payment" , paymentRoutes);
router.use("/dashboard",dashboardRoutes)
router.use("/visaapplication",visaApplicationRoutes)
router.use("/bankdetails",bankdetailsRoutes)
router.use("/clientsInfo" , clientsInfoRoutes);
router.use("/adminControl" , adminControlRoutes);
router.use("/rbac" , rbacRoutes);
router.use("/task-management" , taskRoutes);
// router.use("/migration" , migrationRoutes);
router.use("/logs" , logRoutes);
export default router;