import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./dashboard/Dashboard";
import CustomerLayout from "./CustomerLayout";
import PrevApplications from "./application/PrevApplications";
import Notification from "./notification/Notification";
import Settings from "./settings/Settings";
import SingleVisaApplication from "./dashboard/SingleVisaApplication";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<CustomerLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<PrevApplications />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard/:caseId" element={<SingleVisaApplication />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
