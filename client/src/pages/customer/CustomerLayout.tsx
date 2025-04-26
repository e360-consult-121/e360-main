import { Outlet } from "react-router-dom";
import Sidebar, { TAB } from "../../components/Sidebar";
import CustomerHeader from "../../components/CustomerHeader";

const tabs: TAB[] = [
  {
    icon: "icon-park-outline:dashboard",
    label: "Dashboard",
    route: "dashboard",
  },
  {
    icon: "icon-park-outline:folder-block-one",
    label: "Previous Applications",
    route: "applications",
  },
  {
    icon: "icon-park-outline:remind",
    label: "Notification",
    route: "notification",
  },
  {
    icon: "icon-park-outline:setting",
    label: "Settings",
    route: "settings",
  },
];

const CustomerLayout = () => {

  return (
    <div className="h-screen flex flex-1 overflow-hidden">
      {/* Sidebar portion */}
      <div className="w-full h-full flex-[0.2]">
        <Sidebar tabs={tabs} />
      </div>

      {/* Main content portion */}
      <div className="w-full h-full flex-[0.8] flex flex-col  pt-7">
        {/* Top header portion */}
        <div className="w-full h-full flex-[0.08] px-5">
          <CustomerHeader />
        </div>

        <div className="w-full h-full flex-[0.92] overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
