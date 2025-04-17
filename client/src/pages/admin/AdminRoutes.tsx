import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
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
import { useFetchUserQuery } from "../../features/auth/authApi";
import { useEffect } from "react";

const AdminRoutes = () => {

  const navigate = useNavigate();
  const { data, isSuccess, isError } = useFetchUserQuery(undefined);  

   useEffect(() => {
      if (isError) {
        navigate("/admin/login");
      }
    }, [isError,navigate,isSuccess, data]);
  
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
      <Route path="*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  );
};

export default AdminRoutes;
