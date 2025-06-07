import { useNavigate, useParams } from "react-router-dom";
import AllEmployeeTable from "./AllEmployeeTable";
import ManageRoles from "./ManageRoles";
import { Box, Tab, Tabs } from "@mui/material";

const RoleAndPermission = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const handleChange = (_event: React.SyntheticEvent, newValue: any) => {
    navigate(`/admin/roleandpermission/${newValue}`);
  };

  return (
    <div className="px-5">
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={type}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label="All Employees"
            value="allemployee"
            sx={{ textTransform: "none" }}
          />
          <Tab
            label="Manage Roles"
            value="manageroles"
            sx={{ textTransform: "none" }}
          />
        </Tabs>
      </Box>
      {type === "allemployee" ? <AllEmployeeTable /> : <ManageRoles />}
    </div>
  );
};

export default RoleAndPermission;
