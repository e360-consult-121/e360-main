import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import CustomerLayout from "./CustomerLayout";
import PrevApplications from "./application/PrevApplications";
import Notification from "./notification/Notification";
import Settings from "./settings/Settings";
import ApplicationMain from "./dashboard/ApplicationMain";

const CustomerRoutes = () => {


  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<PrevApplications />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/application/:caseId" element={<ApplicationMain />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
