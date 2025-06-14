import {
  Box,
  Typography,
  Paper,
  IconButton,
  Divider,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import { useState } from "react";
import { useFetchAllFeaturesQuery } from "../../../features/admin/RoleandPermission/roleAndPermissionApi";

type Action = {
  _id: string;
  action: string;
};

const ManageRoles = () => {
  const { data, isLoading, error } = useFetchAllFeaturesQuery(undefined);
  const [sortBy, setSortBy] = useState("name");

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading features</Typography>;

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const sortedFeatures = [...(data?.features || [])].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const fakeRoles = ["Admin", "Stafff", "Manager"]; // You can map with real roles later

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Select
          value={sortBy}
          onChange={handleSortChange}
          startAdornment={<SortIcon />}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="name">Sort By Name</MenuItem>
        </Select>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: "#FFD700", color: "#000", borderRadius: 20 }}
        >
          Add New Task
        </Button>
      </Box>

      {fakeRoles.map((role, idx) => (
        <Paper key={idx} elevation={1} sx={{ p: 2, mb: 3, bgcolor: "#f9f9f9" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              {role}
            </Typography>
            <Box>
              <IconButton>
                <EditIcon />
              </IconButton>
              <IconButton>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          </Box>

          {sortedFeatures.slice(0, 3).map((feature) => (
            <Box
              key={feature._id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1}
              borderRadius={1}
              border="1px solid #ddd"
              mb={1}
              bgcolor="white"
            >
              <Typography variant="body2" color="text.secondary">
                {feature.actions.map((a:any) => a.action.split(/(?=[A-Z])/).join(" ")).join(" / ")}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {feature.name}
              </Typography>
            </Box>
          ))}
        </Paper>
      ))}
    </Box>
  );
};

export default ManageRoles;