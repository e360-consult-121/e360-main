import { useEffect, useState } from "react";
import {
  Drawer,
  Typography,
  Box,
  TextField,
  MenuItem,
  IconButton,
  Button,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ManagePermissionsDrawer from "./ManagePermissionsDrawer";
import { useAddNewAdminUserMutation, useFetchAllRolesQuery } from "../roleAndPermissionApi";
import { toast } from "react-toastify";

const AddEmployeeDrawer = ({ open, onClose,refetchAllAdminUsers }: { open: boolean; onClose: () => void,refetchAllAdminUsers:()=>void }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    nationality:"",
    autoGeneratePassword: false,
  });

  const [openPermissions, setOpenPermissions] = useState(false);
  const [newlyCreatedRoleId, setNewlyCreatedRoleId] = useState<string | null>(null);

  const { data: roles ,refetch:refetchAllRoles} = useFetchAllRolesQuery(undefined);

  const [addNewAdminUser, { isLoading }] = useAddNewAdminUserMutation();

  useEffect(() => {
  if (newlyCreatedRoleId) {
    setFormData((prev) => ({ ...prev, role: newlyCreatedRoleId }));
    setNewlyCreatedRoleId(null);
  }
}, [roles]);


  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

const handleSubmit = async () => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
    nationality,
    autoGeneratePassword,
  } = formData;

  if (!firstName || !lastName || !email || (!autoGeneratePassword && !password) || !role) {
    toast.error("Please fill all required fields.");
    return;
  }

  const finalPassword = autoGeneratePassword
    ? Math.random().toString(36).slice(-8) + "@123"
    : password;



  const body = {
    name: `${firstName} ${lastName}`,
    email,
    phone,
    nationality,
    password: finalPassword,
    roleName: role,
    actionIds: [],
  };
  console.log(body)

  try {
    await addNewAdminUser(body).unwrap();
    toast.success("Employee added successfully!");

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      password: "",
      nationality: "",
      autoGeneratePassword: false,
    });
    onClose();
    refetchAllAdminUsers();
  } catch (error) {
    toast.error("Failed to add employee");
    console.error("Error adding employee:", error);
  }
};


  return (
    <>
      {/* add adminuser Drawer */}
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width:{  xs:370,md:400}, padding: 3 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Add New Employee</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form Fields */}
        <Box component="form" display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="First Name*"
              variant="outlined"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
            <TextField
              fullWidth
              label="Last Name*"
              variant="outlined"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </Box>
          <TextField
            fullWidth
            label="Nationality*"
            variant="outlined"
            value={formData.nationality}
            onChange={(e) => handleChange("nationality", e.target.value)}
          />
          <TextField
            fullWidth
            label="Email ID*"
            variant="outlined"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <TextField
            fullWidth
            label="Phone Number*"
            variant="outlined"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.autoGeneratePassword}
                onChange={(e) => handleChange("autoGeneratePassword", e.target.checked)}
              />
            }
            label="Auto-generate password"
          />

          {!formData.autoGeneratePassword && (
            <TextField
              fullWidth
              label="Password*"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          )}

          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <InputLabel sx={{ color: "#000", fontWeight: 500 }}>
                Role*
              </InputLabel>
              <Button
                startIcon={<AddIcon />}
                sx={{ color: "#FFC107", textTransform: "none" }}
                onClick={() => setOpenPermissions(true)}
              >
                Add Custom Role
              </Button>
            </Box>

            <FormControl fullWidth variant="outlined">
              <Select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                displayEmpty
              >
                {roles?.roles?.map((role: any) => (
                  <MenuItem key={role.roleName} value={role._id}>
                    {role.roleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "red",
                color: "red",
                borderRadius: 8,
                width: "48%",
                textTransform: "none",
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{
                backgroundColor: "#FFC107",
                color: "#000",
                borderRadius: 8,
                width: "48%",
                textTransform: "none",
                "&:hover": { backgroundColor: "#e6b800" },
                boxShadow: "none",
              }}
            >
              {isLoading ? "Adding..." : "Add Employee"}
            </Button>
          </Box>
        </Box>
      </Drawer>

      <ManagePermissionsDrawer open={openPermissions} onClose={() => setOpenPermissions(false)} 
      isAdding={true} 
      refetchAllRoles={refetchAllRoles}
      onRoleCreated={(newRoleId: string) => {
    setNewlyCreatedRoleId(newRoleId); // capture new role
    setOpenPermissions(false); // optionally close drawer
  }}
        />
    </>
  );
};

export default AddEmployeeDrawer;
