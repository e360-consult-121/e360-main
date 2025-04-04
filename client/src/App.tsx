import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminRoutes from "./pages/admin/AdminRoutes";
import CustomerRoutes from "./pages/customer/CustomerRoutes";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./pages/auth/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminRoutes />
          </ProtectedRoute>
          } />

        {/* Protected Customer routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <CustomerRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
