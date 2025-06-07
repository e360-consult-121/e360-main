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
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const roles = ["Staff", "Admin", "Accountant"];

const functions = ["Search Employee","Announcements","Quick Links","New joinee list"]

const AddEmployeeDrawer = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [customRoleDrawerOpen, setCustomRoleDrawerOpen] = useState(false);
  const [role, setRole] = useState("");

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
                onClick={() => setCustomRoleDrawerOpen(true)}
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

      {/* Nested Drawer for Add Role */}
      <Drawer
        anchor="right"
        open={customRoleDrawerOpen}
        onClose={() => setCustomRoleDrawerOpen(false)}
        PaperProps={{ sx: { width: 400, padding: 3 } }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Add Custom Role
          </Typography>
          <IconButton onClick={() => setCustomRoleDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" display="flex" flexDirection="column" gap={2}>
          <TextField fullWidth label="Enter the Role Name" variant="outlined" />
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Typography sx={{ fontWeight: "bold" }}>
              Function Based Permission
            </Typography>
          </Box>
          
          <Box component="form" display="row" flexDirection="column" gap={2}>
           {functions.map((func)=>(
            <div className="flex">
            <Switch
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "white",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "green",
                },
              }}
            />
            <Typography sx={{p:1}}>{func}</Typography>
            </div>
           )) }
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AddEmployeeDrawer;
