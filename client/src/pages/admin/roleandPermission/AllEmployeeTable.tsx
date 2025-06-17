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
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddEmployeeDrawer from "../../../features/admin/RoleandPermission/component/AddEmployeeDrawer";
import {
  useDeleteAdminUserMutation,
  useEditAdminUserMutation,
} from "../../../features/admin/RoleandPermission/roleAndPermissionApi";
import { toast } from "react-toastify";
import { Cancel, Save } from "@mui/icons-material";

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
  refetchAllAdminUsers: () => void;
}

const AllEmployee = ({ groupedByRoleName, refetchAllAdminUsers }: Props) => {
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [employeeDrawerOpen, setEmployeeDrawerOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedEmployee, setEditedEmployee] = useState<Partial<Employee>>({});
  console.log(groupedByRoleName)
  const [deleteAdminUser] = useDeleteAdminUserMutation();
  const [editAdminUser] = useEditAdminUserMutation();

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

  const handleFieldChange = (field: keyof Employee, value: string) => {
    setEditedEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editingId) return;
    const original = employeeData.find((emp) => emp.id === editingId);
    if (!original) return;

    const updatedFields: any = {};
    for (const key in editedEmployee) {
      if (
        editedEmployee[key as keyof Employee] !==
        original[key as keyof Employee]
      ) {
        updatedFields[key] = editedEmployee[key as keyof Employee];
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes detected.");
      return;
    }

    try {
      await editAdminUser({
        employeeId: editingId,
        body: updatedFields,
      }).unwrap();
      toast.success("Employee updated!");
      setEditingId(null);
      setEditedEmployee({});
      refetchAllAdminUsers();
    } catch (err) {
      toast.error("Failed to update.");
    }
  };

  const handleEditRowClick = (employee: Employee) => {
    setEditingId(employee.id);
    setEditedEmployee({ ...employee });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = currentData.map((row) => row.id);
      setSelectedIds(newSelected);
    } else {
      setSelectedIds([]);
    }
  };

  const handleCheckboxChange = (id: string) => {
    const updatedSelected = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(updatedSelected);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteUser = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAdminUser(id).unwrap();
      refetchAllAdminUsers();
      toast.success("Successfully deleted adminUser!");
    } catch (error) {
      toast.error("Something went wrong while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box p={1}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
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
            boxShadow:"none"
          }}
        >
          Add New Employee
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={currentData.every((row) =>
                    selectedIds.includes(row.id)
                  )}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((employee) => {
              const isEditing = editingId === employee.id;
              return (
                <TableRow
                  key={employee.id}
                  // onClick={() => !editingId && handleEditRowClick(employee)}
                >
                  <TableCell padding="checkbox"
                  sx={{ borderBottom: "none" }}
                  >
                    <Checkbox
                      checked={selectedIds.includes(employee.id)}
                      onChange={() => handleCheckboxChange(employee.id)}
                      disabled={!!editingId && editingId !== employee.id}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>{employee.id}</TableCell>
                  <TableCell
                  sx={{ borderBottom: "none" }}
                  >
                    {isEditing ? (
                      <TextField
                        value={editedEmployee.firstName || ""}
                        onChange={(e) =>
                          handleFieldChange("firstName", e.target.value)
                        }
                        size="small"
                        fullWidth
                      />
                    ) : (
                      employee.firstName
                    )}
                  </TableCell>
                  <TableCell
                  sx={{ borderBottom: "none" }}
                  >
                    {isEditing ? (
                      <TextField
                        value={editedEmployee.lastName || ""}
                        onChange={(e) =>
                          handleFieldChange("lastName", e.target.value)
                        }
                        size="small"
                        fullWidth
                      />
                    ) : (
                      employee.lastName
                    )}
                  </TableCell>
                  <TableCell
                  sx={{ borderBottom: "none" }}
                  >
                    {isEditing ? (
                      <TextField
                        value={editedEmployee.role || ""}
                        onChange={(e) =>
                          handleFieldChange("role", e.target.value)
                        }
                        size="small"
                        fullWidth
                      />
                    ) : (
                      employee.role
                    )}
                  </TableCell>
                  <TableCell
                  sx={{ borderBottom: "none" }}
                  >
                    {isEditing ? (
                      <TextField
                        value={editedEmployee.contact || ""}
                        onChange={(e) =>
                          handleFieldChange("contact", e.target.value)
                        }
                        size="small"
                        fullWidth
                      />
                    ) : (
                      employee.contact
                    )}
                  </TableCell>
                  <TableCell
                  sx={{ borderBottom: "none" }}
                  >
                    {isEditing ? (
                      <TextField
                        value={editedEmployee.email || ""}
                        onChange={(e) =>
                          handleFieldChange("email", e.target.value)
                        }
                        size="small"
                        fullWidth
                      />
                    ) : (
                      employee.email
                    )}
                  </TableCell>
                  <TableCell
                  sx={{ borderBottom: "none" }}
                  >
                    {isEditing ? (
                      <Box display={"flex"}>
                         <IconButton
                          color="error"
                          onClick={() => {
                            setEditingId(null);
                            setEditedEmployee({});
                          }}
                          size="small"
                        >
                          <Cancel/>
                        </IconButton>
                        <IconButton
                          onClick={handleSave}
                          color="success"
                          size="small"
                        >
                          <Save/>
                        </IconButton>
                      </Box>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => handleEditRowClick(employee)}
                          disabled={!!editingId}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteUser(employee.id)}
                          disabled={!!editingId || deletingId === employee.id}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={employeeData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <AddEmployeeDrawer
        refetchAllAdminUsers={refetchAllAdminUsers}
        open={employeeDrawerOpen}
        onClose={() => setEmployeeDrawerOpen(false)}
      />
    </Box>
  );
};

export default AllEmployee;
