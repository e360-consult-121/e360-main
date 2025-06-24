import { Router } from "express";
import * as invoicesControllers from "../../../controllers/admin/invoiceManagement/invoicesControllers";
import { authenticate, authorizeAdmin } from "../../../middlewares/authenticate";

const router = Router();

router.get("/fetchAllInvoices",authenticate,authorizeAdmin, invoicesControllers.getAllInvoicesData);
router.get("/fetchInvoicesStats",authenticate,authorizeAdmin, invoicesControllers.getInvoiceStats);

export default router;
