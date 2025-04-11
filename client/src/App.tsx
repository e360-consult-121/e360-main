import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminRoutes from "./pages/admin/AdminRoutes";
import CustomerRoutes from "./pages/customer/CustomerRoutes";
import ProtectedRoute from "./utils/ProtectedRoute";
import AuthPage from "./pages/auth/AuthPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage mode="SIGN_IN" />} />
        <Route path="/register" element={<AuthPage mode="SIGN_UP" />} />

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
