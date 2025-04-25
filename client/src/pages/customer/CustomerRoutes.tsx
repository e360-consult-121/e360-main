import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import CustomerLayout from "./CustomerLayout";
import PrevApplications from "./application/PrevApplications";
import Notification from "./notification/Notification";
import Settings from "./settings/Settings";
import { useFetchUserQuery } from "../../features/auth/authApi";
import { useEffect } from "react";
import VisaApplicationProcess from "./dashboard/VisaApplicationProcess";

const CustomerRoutes = () => {


  const navigate = useNavigate();
  const { data, isSuccess, isError } = useFetchUserQuery(undefined);  

   useEffect(() => {
      if (isError) {
        navigate("/login");
      }
    }, [isError,navigate,isSuccess, data]);

  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<PrevApplications />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/application/:visaApplicationId" element={<VisaApplicationProcess />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
