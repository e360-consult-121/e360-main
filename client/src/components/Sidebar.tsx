import { Icon } from "@iconify/react";
import logoMark from "../assets/logomark.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export type TAB = {
  label: string;
  route: string;
  icon: string;
};

const SidebarTab = ({
  tabInfo,
  isActive,
}: {
  tabInfo: TAB;
  isActive: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate("/" + tabInfo.route);
      }}
      className={`w-full flex items-center justify-between cursor-pointer hover:text-golden-yellow-400 ${
        isActive ? "text-golden-yellow-400" : "text-neutrals-400"
      } `}
    >
      <div className="flex items-center space-x-4">
        <Icon icon={tabInfo.icon} width="20" height="20" />
        <p className="text-sm">{tabInfo.label}</p>
      </div>

      <Icon
        icon="material-symbols-light:chevron-right-rounded"
        width="34"
        height="34"
      />
    </div>
  );
};

const Sidebar = ({ tabs }: { tabs: TAB[] }) => {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");

  const location = useLocation();

  useEffect(() => {
    setCurrentTab(location.pathname.split("/")[1]);
  }, [location.pathname]);

  return (
    <div className="w-full h-full bg-neutrals-950 py-7 px-3 flex flex-col flex-1">
      <div className="w-full h-full flex justify-center flex-[0.1]">
        <img
          src={logoMark}
          alt="E360 logo"
          className="w-[73px] object-contain"
        />
      </div>

      <div className="w-full flex flex-col h-full flex-[0.9] justify-between">
        {/* Top list contents */}
        <div className="w-full space-y-5 mt-10">
          {tabs.map((tab, index) => (
            <SidebarTab
              key={index}
              tabInfo={tab}
              isActive={currentTab == tab.route}
            />
          ))}
        </div>

        {/* Logout option */}
        <div className="w-full">
          <div className="w-full flex items-center justify-between text-red-500 cursor-pointer">
            <div className="flex items-center space-x-4">
              <Icon icon={"icon-park-outline:logout"} width="20" height="20" />
              <p className="text-sm">Logout</p>
            </div>

            <Icon
              icon="material-symbols-light:chevron-right-rounded"
              width="34"
              height="34"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
