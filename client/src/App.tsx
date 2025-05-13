import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminRoutes from "./pages/admin/AdminRoutes";
import CustomerRoutes from "./pages/customer/CustomerRoutes";
import ProtectedRoute from "./utils/ProtectedRoute";
import AuthPage from "./pages/auth/AuthPage";
import AdminLogin from "./pages/admin/AdminLogin"
import ForgotPassword from "./features/auth/components/ForgotPassword";
import ResetPassword from "./features/auth/components/ResetPasword";
import ClientPaymentComponent from "./components/ClientPaymentComponent";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage mode="SIGN_IN" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/payments/:leadId" element={<ClientPaymentComponent />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

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
