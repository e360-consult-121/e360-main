import globeAnim from "../../assets/animations/login-anim.gif";
import logo from "../../assets/logo.png";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { RootState } from "../../app/store";
import { Roles } from "../../features/auth/authTypes";
import { useLoginMutation } from "../../features/auth/authApi";
import Toggle from "../../components/Toggle";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === Roles.USER) {
      navigate("/dashboard");
    }
    if (user?.role === Roles.ADMIN) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !password) return toast.info("All Fields are required");
      if (!emailRegex.test(email)) return toast.error("Enter a valid email");

      await login({ email, password, role: Roles.ADMIN })
        .unwrap()
        .then(() => {
          toast.success("Login successful! Welcome Admin");
        });
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row items-center justify-center px-5">
      {/* Left animation - hidden on small screens */}
      <div className="hidden md:flex md:w-full h-[90%] flex-[0.6] rounded-[20px]">
        <img
          src={globeAnim}
          alt="globe animation"
          className="w-full h-full object-cover rounded-[20px]"
        />
      </div>

      {/* Right section - full width on mobile */}
      <div className="w-full h-full md:h-[90%] md:flex-[0.4] flex items-center justify-center">
        <div className="w-full sm:w-4/5 md:w-3/4 max-w-[400px]">
          <img
            src={logo}
            alt="E360 logo"
            className="w-[130px] md:w-[163px] object-contain"
          />

          <div className="flex flex-col mt-10 md:mt-14 mb-7 space-y-2">
            <p className="text-neutrals-400">Nice to see you!</p>
            <h1 className="text-2xl text-neutrals-950">
              Sign in to your Account
            </h1>
          </div>

          {/* Email Input */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-4">
              <p className="text-neutrals-950 text-xs px-2">Login</p>
              <input
                type="text"
                placeholder="Email or phone number"
                className="w-full px-4 py-3 bg-neutrals-50 rounded-lg outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col space-y-4">
              <p className="text-neutrals-950 text-xs px-2">Password</p>
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
          <div className="my-6 flex justify-between items-center">
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
