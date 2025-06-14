import { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const permissions = [
  { name: "Permission 1", function: "Function 1" },
  { name: "Permission 2", function: "Function 2" },
  { name: "Permission 3", function: "Function 3" },
  { name: "Permission 4", function: "Function 4" },
  { name: "Permission 5", function: "Function 5" },
  { name: "Permission 6", function: "Function 6" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const ManagePermissionsDrawer = ({ open, onClose }: Props) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleToggle = (permName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permName)
        ? prev.filter((p) => p !== permName)
        : [...prev, permName]
    );
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 1000, p: 3 } }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Manage Permissions
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box bgcolor="#f5f3f3" p={2} borderRadius={2} mb={3}>
        <Typography fontWeight={500} mb={1}>
          Role
        </Typography>
        <TextField fullWidth disabled value="Team Manager" />

        {selectedPermissions.map((perm) => {
          const func = permissions.find((p) => p.name === perm)?.function;
          return (
            <Box key={perm} display="flex" justifyContent="space-between" mt={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <RemoveCircleIcon fontSize="small" color="error" onClick={() => handleToggle(perm)} sx={{ cursor: "pointer" }} />
                <Typography>{perm}</Typography>
              </Box>
              <Typography>{func}</Typography>
            </Box>
          );
        })}

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FFC107",
              color: "#000",
              borderRadius: 8,
              textTransform: "none",
              "&:hover": { backgroundColor: "#e6b800" },
              boxShadow: "none",
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by Permission or function"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* Permission List */}
      <List>
        {permissions.map((p) => (
          <ListItem key={p.name} disablePadding>
            <ListItemIcon>
              <Checkbox
                checked={selectedPermissions.includes(p.name)}
                onChange={() => handleToggle(p.name)}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <AddCircleOutlineIcon fontSize="small" color="warning" />
                  {p.name}
                </Box>
              }
              secondary={p.function}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default ManagePermissionsDrawer;
