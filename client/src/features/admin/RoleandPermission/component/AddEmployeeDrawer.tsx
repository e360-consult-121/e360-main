import { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ManagePermissionsDrawer from "./ManagePermissionsDrawer";

const roles = ["Staff", "Admin", "Accountant"];


const AddEmployeeDrawer = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [role, setRole] = useState("");
  const [openPermissions, setOpenPermissions] = useState(false);


  return (
    <>
      {/* Primary Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: 400, padding: 3 } }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" sx={{fontWeight:"bold"}}>Add New Employee</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form Fields */}
        <Box component="form" display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={2}>
            <TextField fullWidth label="First Name*" variant="outlined" />
            <TextField fullWidth label="Last Name*" variant="outlined" />
          </Box>
          <TextField
            fullWidth
            label="Employee ID (Optional)"
            variant="outlined"
          />
          <TextField fullWidth label="Email ID*" variant="outlined" />
          <TextField fullWidth label="Phone Number*" variant="outlined" />

          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
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
                value={role}
                onChange={(e) => setRole(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Enter User Role
                </MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined"
              sx={{
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
              sx={{
                backgroundColor: "#FFC107",
                color: "#000",
                borderRadius: 8,
                width: "48%",
                textTransform: "none",
                "&:hover": { backgroundColor: "#e6b800" },
                boxShadow:"none"
              }}
            >
              Add Employee
            </Button>
          </Box>
        </Box>
      </Drawer>
      <ManagePermissionsDrawer open={openPermissions} onClose={() => setOpenPermissions(false)} />

    </>
  );
};

export default AddEmployeeDrawer;
