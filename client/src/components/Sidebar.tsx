import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoMark from "../assets/logomark.png";

export type TAB = {
  label: string;
  route: string;
  icon: string;
  children?: TAB[]; // Optional dropdown sub-tabs
};

const SidebarTab = ({
  tabInfo,
  isActive,
}: {
  tabInfo: TAB;
  isActive: boolean;
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // console.log(tabInfo.route.split("/")[1])
  

  const hasChildren = tabInfo.children && tabInfo.children.length > 0;

  return (
    <div className="w-full">
      <div
        onClick={() => {
          if (hasChildren) {
            setIsOpen(!isOpen);
          } else {
            navigate("/" + tabInfo.route);
          }
        }}
        className={`w-full flex items-center justify-between cursor-pointer hover:text-golden-yellow-400 ${
          isActive ? "text-golden-yellow-400" : "text-neutrals-400"
        } `}
      >
        <div className="flex items-center space-x-4">
          <Icon icon={tabInfo.icon} width="20" height="20" />
          <p className="text-sm">{tabInfo.label}</p>
        </div>

        {hasChildren ? (
          <Icon
            icon={isOpen ? "material-symbols-light:expand-less" : "material-symbols-light:chevron-right-rounded"}
            width="34"
            height="34"
          />
        ) : (
          <Icon
            icon="material-symbols-light:chevron-right-rounded"
            width="34"
            height="34"
          />
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="ml-6 mt-2 space-y-2">
          {tabInfo.children!.map((child, index) => (
            <div
              key={index}
              onClick={() => navigate("/" + child.route)}
              className="cursor-pointer flex items-center space-x-4 text-neutrals-400 hover:text-golden-yellow-400"
            >
              <Icon icon={child.icon} width="18" height="18" />
              <p className="text-sm">{child.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ tabs }: { tabs: TAB[] }) => {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const location = useLocation();
  // console.log(location.pathname)

  
   useEffect(() => {
    setCurrentTab(location.pathname.split("/")[2]);
    // console.log(currentTab)
  }, [location.pathname]);

  return (
    <div className="w-full h-full bg-neutrals-950 py-7 px-3 flex flex-col flex-1">
      {/* Logo Section */}
      <div className="w-full h-full flex justify-center flex-[0.1]">
        <img
          src={logoMark}
          alt="E360 logo"
          className="w-[73px] object-contain"
        />
      </div>

      {/* Sidebar Tabs */}
      <div className="w-full flex flex-col h-full flex-[0.9] justify-between">
        <div className="w-full space-y-5 mt-10">
          {tabs.map((tab, index) => (
            <SidebarTab
              key={index}
              tabInfo={tab}
              isActive={currentTab === tab.route.split("/")[1]}
            />
          ))}
        </div>

        {/* Logout Option */}
        <div className="w-full">
          <div className="w-full flex items-center justify-between text-red-500 cursor-pointer">
            <div className="flex items-center space-x-4">
              <Icon icon="icon-park-outline:logout" width="20" height="20" />
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

