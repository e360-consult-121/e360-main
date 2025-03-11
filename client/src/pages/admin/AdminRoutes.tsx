import { Route, Routes } from "react-router-dom";
import Login from "./Login";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AdminRoutes;
