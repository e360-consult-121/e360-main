import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminRoutes from "./pages/admin/AdminRoutes";
import CustomerRoutes from "./pages/customer/CustomerRoutes";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Customer routes */}
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
