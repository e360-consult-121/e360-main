import { Router } from "express";
import * as invoicesControllers from "../../../controllers/admin/invoiceManagement/invoicesControllers";
import { authenticate, authorizeAdmin } from "../../../middlewares/authenticate";
import { checkPermission } from "../../../middlewares/permissionMiddleware";
import { addArrayForStaff } from "../../../middlewares/addArrayForStaff";
const router = Router();

router.get("/fetchAllInvoices",
authenticate,authorizeAdmin,
checkPermission("View_Invoices"),
invoicesControllers.getAllInvoicesData);



router.get("/fetchInvoicesStats",
authenticate,authorizeAdmin, 
checkPermission("View_Invoices"),
invoicesControllers.getInvoiceStats);

export default router;
