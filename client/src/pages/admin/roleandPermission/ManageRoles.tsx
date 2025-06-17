import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import { useState } from "react";
import { useFetchRoleWisePermissionsQuery } from "../../../features/admin/RoleandPermission/roleAndPermissionApi";
import ManagePermissionsDrawer from "../../../features/admin/RoleandPermission/component/ManagePermissionsDrawer";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";


const ManageRoles = () => {

  const [sortBy, setSortBy] = useState("name");
  const [openPermissions, setOpenPermissions] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    undefined
  );
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(
    undefined
  );
  const [selectedFeatures,setSelectedFeatures] = useState([]);
  const [isAdding,setIsAdding] = useState<boolean>();

    
  const {
    data: rolePermissions,
    isLoading: loadingRoles,
    error: errorRoles,
    refetch
  } = useFetchRoleWisePermissionsQuery(undefined);

  if (loadingRoles || loadingRoles) return <Typography>Loading...</Typography>;
  if (errorRoles || errorRoles)
    return <Typography>Error loading data</Typography>;

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const sortedRolePermissions = [...(rolePermissions || [])].sort((a, b) => {
    return a.roleName.localeCompare(b.roleName);
  });

  return (
    <>
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Select
            value={sortBy}
            onChange={handleSortChange}
            startAdornment={<SortIcon />}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="name">Sort By Name</MenuItem>
          </Select>
          <Button
            onClick={() => {
              setSelectedRole(undefined);
              setOpenPermissions(true);
              setSelectedFeatures([])
              setIsAdding(true)
            }}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              color: "#000",
              borderRadius: 20,
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Add New Role
          </Button>
        </Box>

        {sortedRolePermissions.map((role) => (
          <Paper
            key={role.roleId}
            elevation={1}
            sx={{ p: 2, mb: 3, bgcolor: "#f9f9f9" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight="bold">
                {role.roleName}
              </Typography>
              <Box>
                <IconButton
                  onClick={() => {
                    setSelectedRole(role.roleName); 
                    setSelectedFeatures(role.features)
                     setSelectedRoleId(role.roleId);
                    setOpenPermissions(true);
                    setIsAdding(false)
                  }}
                >
                  <EditIcon fontSize="small"/>
                </IconButton>
                <IconButton>
                  <DeleteOutlinedIcon color="error" fontSize="small"/>
                </IconButton>
              </Box>
            </Box>

            {(role.features || []).length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No features assigned
              </Typography>
            ) : (
              role.features.map((feature: any) => (
                <Box
                  key={feature.featureId}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={1}
                  borderRadius={2}
                  border="1px solid #ddd"
                  mb={1}
                  bgcolor="white"
                >
                  <Typography variant="body2" color="text.secondary">
                    {feature.actions
                      .map((a: any) => a.action.split(/(?=[A-Z])/).join(" "))
                      .join(" / ")}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {feature.name}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        ))}
      </Box>
      <ManagePermissionsDrawer
        selectedRole={selectedRole}
        selectedFeatures={selectedFeatures}
        open={openPermissions}
        onClose={() => {
          setSelectedFeatures([])  
          setOpenPermissions(false)
        }}
        isAdding={isAdding}
        refetchAllFeatures={refetch}
        selectedRoleId={selectedRoleId}
      />
    </>
  );
};

export default ManageRoles;
