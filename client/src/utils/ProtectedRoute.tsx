import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  useDispatch } from 'react-redux';
import { useFetchUserQuery } from '../features/auth/authApi';
import { setAuth } from '../features/auth/authSlice';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { user, isAuthenticated } = useSelector((state: any) => state.auth);

  const { data, isSuccess, isError, isLoading } = useFetchUserQuery(undefined);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
    else if (isSuccess ) {
      if(data.role === "ADMIN"){
        dispatch(setAuth(data));
        navigate("/admin/dashboard");
      }
      else if (data.role === "USER"){
        dispatch(setAuth(data));
        navigate("/dashboard");
      }
    }
  }, [isError,navigate,isSuccess, data, dispatch]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoute;
