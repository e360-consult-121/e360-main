import globeAnim from "../../assets/animations/globe-anim.gif";
import logo from "../../assets/logo.png";
import { Icon } from "@iconify/react";
import Toggle from "../../components/Toggle";
import { useState } from "react";
const Login = () => {
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);

  return (
    <div className="w-full h-screen flex flex-1  items-center px-5">
      {/* Left animation */}
      <div className="w-full h-[90%] flex-[0.6] rounded-[20px]">
        <img
          src={globeAnim}
          alt="globe animation"
          className="w-full h-full object-cover rounded-[20px]"
        />
      </div>

      {/* Right animation */}
      <div className="w-full h-[90%] flex-[0.4] flex items-center justify-center">
        <div className="w-3/4">
          <img
            src={logo}
            alt="E360 logo"
            className="w-[163px] object-contain"
          />

          <div className="flex flex-col mt-14  mb-7 space-y-2">
            <p className="text-neutrals-400">Nice to see you!</p>
            <h1 className="text-2xl text-neutrals-950">
              Sign in to your Account
            </h1>
          </div>

          {/* Input fields for email and password */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col w-full space-y-4">
              <p className="text-neutrals-950 text-xs px-4">Login</p>
              <input
                type="text"
                placeholder="Email or phone number"
                className="w-full px-4 py-3 bg-neutrals-50 rounded-lg outline-none"
              />
            </div>

            <div className="flex flex-col w-full space-y-4">
              <p className="text-neutrals-950 text-xs px-4">Password</p>

              <div className="w-full flex items-center bg-neutrals-50 rounded-lg pr-3">
                <input
                  type="password"
                  placeholder="Email or phone number"
                  className="w-full px-4 py-3  outline-none"
                />
                <Icon icon="mdi:eye" width="24" height="24" />
              </div>
            </div>
          </div>

          {/* remember me and forgot password buttons */}
          <div className="my-7 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Toggle isToggled={isRememberMe} setIsToggled={setIsRememberMe} />
              <p className="text-neutrals-950 text-xs">Remember me</p>
            </div>

            <button className="text-xs text-neutrals-400 cursor-pointer">
              Forgot password
            </button>
          </div>

          <button className="w-full bg-golden-yellow-400 py-3 rounded-[20px] cursor-pointer active:scale-95 transition-transform">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
