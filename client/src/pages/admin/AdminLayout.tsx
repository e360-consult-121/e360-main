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
    icon: "iconoir:multiple-pages",
    label: "Applications",
    route: "admin/applications",
    children: [
      {
        label: "Dominica Passport",
        route: "admin/applications/dominica",
        icon: "",
      },
      {
        label: "Greneda Passport",
        route: "admin/applications/greneda",
        icon: "",
      },
      {
        label: "Portugal D7 Visa",
        route: "admin/applications/portugal",
        icon: "",
      },
      {
        label: "Dubai Residency",
        route: "admin/applications/dubai",
        icon: "",
      },
    ],
  },
  {
    icon: "solar:user-speak-bold",
    label: "Consultations",
    route: "admin/consultations",
  },
  {
    icon: "lsicon:user-crowd-outline",
    label: "Lead Management",
    route: "admin/leadmanagement",
  },
  {
    icon: "vaadin:lines-list",
    label: "Service Management",
    route: "admin/servicemanagement",
  },
  {
    icon: "icon-park-outline:bank",
    label: "Manage Bank Details",
    route: "admin/bankdetails",
  },
  {
    icon: "grommet-icons:visa",
    label: "Eligibility Form Leads",
    route: "admin/vipconciergeservice",
  },
  {
    icon: "basil:notification-on-solid",
    label: "Notification",
    route: "admin/notification",
  },
  // {
  //   icon: "icon-park-outline:setting",
  //   label: "Settings",
  //   route: "admin/settings",
  // },
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
