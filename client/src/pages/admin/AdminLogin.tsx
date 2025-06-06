import globeAnim from "../../assets/animations/login-anim.gif";
import logo from "../../assets/logo.png";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import { AppDispatch } from "../../app/store";
import { setAuth } from "../../features/auth/authSlice";
import { Roles } from "../../features/auth/authTypes";
import { useFetchUserQuery, useLoginMutation } from "../../features/auth/authApi";
import Toggle from "../../components/Toggle";
import { toast } from "react-toastify";

const AdminLogin = () => {


  //  const navigate = useNavigate();
    // const dispatch = useDispatch();
    // const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  
  const { data, isSuccess, isError } = useFetchUserQuery(undefined);
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
     if ((isSuccess === true) ) {
     dispatch(setAuth(data));
     navigate("/admin/dashboard")
    }
    else {
      navigate("/admin/login");
    }
  }, [isError,navigate,isSuccess, data, dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !password) return toast.info("All Fields are required");
      if (!emailRegex.test(email)) return toast.error("Enter a valid email");

      const data = await login({ email, password, role: Roles.ADMIN }).unwrap();
      dispatch(setAuth(data));
      toast.success("Login successful! Welcome Admin");
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-1 items-center px-5">
      {/* Left animation */}
      <div className="w-full h-[90%] flex-[0.6] rounded-[20px]">
        <img
          src={globeAnim}
          alt="globe animation"
          className="w-full h-full object-cover rounded-[20px]"
        />
      </div>

      {/* Right section */}
      <div className="w-full h-[90%] flex-[0.4] flex items-center justify-center">
        <div className="w-3/4">
          <img
            src={logo}
            alt="E360 logo"
            className="w-[163px] object-contain"
          />

          <div className="flex flex-col mt-14 mb-7 space-y-2">
            <p className="text-neutrals-400">Nice to see you!</p>
            <h1 className="text-2xl text-neutrals-950">
              Sign in to your Account
            </h1>
          </div>

          {/* Email Input */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col w-full space-y-4">
              <p className="text-neutrals-950 text-xs px-4">Login</p>
              <input
                type="text"
                placeholder="Email or phone number"
                className="w-full px-4 py-3 bg-neutrals-50 rounded-lg outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col w-full space-y-4">
              <p className="text-neutrals-950 text-xs px-4">Password</p>

              <div className="w-full flex items-center bg-neutrals-50 rounded-lg pr-3">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 outline-none bg-neutrals-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-600 hover:text-black"
                >
                  <Icon
                    icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                    width="24"
                    height="24"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="my-7 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Toggle isToggled={isRememberMe} setIsToggled={setIsRememberMe} />
              <p className="text-neutrals-950 text-xs">Remember me</p>
            </div>
            <a href="/forgot-password">
            <button className="text-xs text-neutrals-400 cursor-pointer">
              Forgot password
            </button>
            </a>
          </div>

          {/* Sign In Button */}
          <button
            className={`w-full py-3 rounded-[20px] cursor-pointer active:scale-95 transition-transform flex justify-center items-center ${
              isLoading ? "bg-gray-400" : "bg-golden-yellow-400"
            }`}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
