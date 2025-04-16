import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Dashboard from "./dashboard/Dashboard";
import VisaService from "./visaService/VisaService";
import LeadManagement from "./leadManagement/LeadManagement";
import Consultations from "./consultations/Consultations";
import ServiceManagement from "./serviceManagement/ServiceManagement";
import VIPConciergeService from "./vipConciergeService/VIPConciergeService";
import ClientInformation from "./clientInformation/ClientInformation";
import BankDetails from "./manageBankDetails/BankDetails";
import AdminLogin from "./AdminLogin";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:applications" element={<VisaService />} />
        <Route path="/leadmanagement" element={<LeadManagement />} />
        <Route path="/consultations" element={<Consultations />} />
        <Route path="/servicemanagement" element={<ServiceManagement />} />
        <Route path="/vipconciergeservice" element={<VIPConciergeService />} />
        <Route path="/bankdetails" element={<BankDetails />} />
        <Route path="/consultation/:leadid" element={<ClientInformation />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AdminRoutes;
