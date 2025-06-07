import { Box,  Checkbox, IconButton,  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AssignmentIcon from '@mui/icons-material/Assignment';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  contact: string;
  email: string;
}

export const mockData: Employee[] = Array.from({ length: 25 }).map((_, index) => ({
  id: `E360-DXB-${(index + 1).toString().padStart(3, "0")}`,
  firstName: "Chijioke",
  lastName: "Nkem",
  role: ["Staff", "Admin", "Accountant"][index % 3],
  contact: "+91 7722990033",
  email: "ChijiokeE360@gmail.com",
}));

const TaskManagementTable = () => {

      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(10);
      const [selectedIds, setSelectedIds] = useState<string[]>([]);    
    
      const handleCheckboxChange = (id: string) => {
        const updatedSelected = selectedIds.includes(id)
          ? selectedIds.filter((selectedId) => selectedId !== id)
          : [...selectedIds, id];
    
        setSelectedIds(updatedSelected);
        const selectedRows = mockData.filter((emp) =>
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
    
      const currentData = mockData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );

        const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.checked) {
            const newSelected = currentData.map((row) => row.id);
            setSelectedIds(newSelected);
            console.log("Selected Rows:", currentData);
          } else {
            setSelectedIds([]);
          }
        };
    


 return (
    <Box p={2}>
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
              <TableCell sx={{ color: "#8D8883" }}>Task Name</TableCell>
              <TableCell sx={{ color: "#8D8883" }}>Assigned To</TableCell>
              <TableCell sx={{ color: "#8D8883" }}>Assigned By</TableCell>
              <TableCell sx={{ color: "#8D8883" }}>Status</TableCell>
              <TableCell sx={{ color: "#8D8883" }}>Due Date</TableCell>
              <TableCell sx={{ color: "#8D8883" }}>Priority</TableCell>
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
                    <AssignmentIcon fontSize="small" />
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
        count={mockData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* add employee Drawer */}
      {/* <AddEmployeeDrawer
        open={employeeDrawerOpen}
        onClose={() => setEmployeeDrawerOpen(false)}
      /> */}
    </Box>
  );
}

export default TaskManagementTable