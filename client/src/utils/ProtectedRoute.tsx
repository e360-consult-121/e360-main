import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFetchUserQuery } from '../features/auth/authApi';
import { setAuth } from '../features/auth/authSlice';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);

  const { data, isSuccess, isError, isLoading } = useFetchUserQuery(undefined);

  useEffect(() => {
    // console.log(data)
    if ((isSuccess && data?.data) ) {
    // console.log(data)
     dispatch(setAuth(data));
     navigate("/dashboard");
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  if (isLoading) return <div>Loading...</div>;

  if (!user && !isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
