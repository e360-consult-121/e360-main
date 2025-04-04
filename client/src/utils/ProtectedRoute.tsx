import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!user &&  !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;
