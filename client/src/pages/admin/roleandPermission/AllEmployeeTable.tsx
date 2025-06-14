import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ForwardIcon from "@mui/icons-material/Forward";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddEmployeeDrawer from "../../../features/admin/RoleandPermission/component/AddEmployeeDrawer";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  contact: string;
  email: string;
}

interface Props {
  groupedByRoleName: {
    role: string;
    users: {
      _id: string;
      email: string;
      role: string;
      roleInfo: {
        roleName: string;
      };
    }[];
  }[];
}

const AllEmployee = ({ groupedByRoleName }: Props) => {
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [employeeDrawerOpen, setEmployeeDrawerOpen] = useState(false);

  const employeeData: Employee[] = groupedByRoleName.flatMap((group) =>
    group.users.map((user) => ({
      id: user._id,
      firstName: "-", 
      lastName: "-",
      role: group.role || user.role || "N/A",
      contact: "-", 
      email: user.email,
    }))
  );

  const currentData = employeeData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSortChange = (event: any) => setSortBy(event.target.value);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = currentData.map((row) => row.id);
      setSelectedIds(newSelected);
      console.log("Selected Rows:", currentData);
    } else {
      setSelectedIds([]);
    }
  };

  const handleCheckboxChange = (id: string) => {
    const updatedSelected = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];

    setSelectedIds(updatedSelected);
    const selectedRows = employeeData.filter((emp) =>
      updatedSelected.includes(emp.id)
    );
    console.log("Selected Rows:", selectedRows);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box p={1}>
      {/* Header Controls */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Select
          value={sortBy}
          onChange={handleSortChange}
          displayEmpty
          size="small"
        >
          <MenuItem value="">Sort By</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="role">Role</MenuItem>
        </Select>
        <Button
          variant="contained"
          onClick={() => setEmployeeDrawerOpen(true)}
          sx={{
            textTransform: "none",
            borderRadius: 20,
            backgroundColor: "#FFC107",
            color: "#000",
            boxShadow: "none",
          }}
        >
          Add New Employee
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ color: "#8D8883" }}>
                <Checkbox
                  checked={
                    currentData.length > 0 &&
                    currentData.every((row) => selectedIds.includes(row.id))
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ color: "#8D8883" }}>Employee ID</TableCell>
              <TableCell sx={{ color: "#8D8883" }}>First Name</TableCell>
              <TableCell sx={{ color: "#8D8883" }}>Last Name</TableCell>
              <TableCell sx={{ color: "#8D8883" }}>Role</TableCell>
              <TableCell sx={{ color: "#8D8883" }}>Contact Number</TableCell>
              <TableCell sx={{ color: "#8D8883" }}>Email</TableCell>
              <TableCell sx={{ color: "#8D8883" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentData.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell padding="checkbox" sx={{ borderBottom: "none" }}>
                  <Checkbox
                    checked={selectedIds.includes(employee.id)}
                    onChange={() => handleCheckboxChange(employee.id)}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {employee.id}
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {employee.firstName}
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {employee.lastName}
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {employee.role}
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {employee.contact}
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {employee.email}
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  <IconButton>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton>
                    <ForwardIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Table Pagination */}
      <TablePagination
        component="div"
        count={employeeData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add Employee Drawer */}
      <AddEmployeeDrawer
        open={employeeDrawerOpen}
        onClose={() => setEmployeeDrawerOpen(false)}
      />
    </Box>
  );
};

export default AllEmployee;
