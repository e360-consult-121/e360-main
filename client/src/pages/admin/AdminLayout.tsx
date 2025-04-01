import { Outlet } from "react-router-dom";
import Sidebar, { TAB } from "../../components/Sidebar";
import AdminHeader from "../../components/AdminHeader";

const tabs:TAB[] = [
  {
    icon: "icon-park-outline:dashboard",
    label: "Dashboard",
    route: "admin/dashboard",
  },
  {
    icon: "icon-park-outline:folder-block-one",
    label: "Applications",
    route: "admin/applications",
    children: [
      {
        label: "Dominica Passport",
        route: "admin/dominica",
        icon: "icon-park-outline:folder-block-one",
      },
      {
        label: "Greneda Passport",
        route: "admin/gredena",
        icon: "icon-park-outline:folder-block-one",
      },
    ],
  },
  {
    icon: "icon-park-outline:remind",
    label: "Consultations",
    route: "admin/consultations",
  },
  {
    icon: "icon-park-outline:setting",
    label: "Lead Management",
    route: "admin/leadmanagement",
  },
  {
    icon: "icon-park-outline:setting",
    label: "Service Management",
    route: "admin/servicemanagement",
  },
  {
    icon: "icon-park-outline:setting",
    label: "VIP Concierge Service",
    route: "admin/vipconciergeservice",
  },
  {
    icon: "icon-park-outline:setting",
    label: "Notification",
    route: "admin/notification",
  },
  {
    icon: "icon-park-outline:setting",
    label: "Settings",
    route: "admin/settings",
  },
];

const AdminLayout = () => {
  return (
    <div className="h-screen flex ">
      {/* Sidebar portion */}
      <div className="w-full h-full flex flex-1/4">
        <Sidebar tabs={tabs} />
      </div>

      {/* Main content portion */}
      <div className="w-full overflow-y-auto px-1">
        <div className="w-full">
          <AdminHeader />
        </div>

        <div className="w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
