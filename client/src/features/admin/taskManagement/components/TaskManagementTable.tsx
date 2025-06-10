import {
  Box,
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
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";

const TaskManagementTable = ({ tasks }: { tasks: any[] }) => {
  // console.log(tasks);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleCheckboxChange = (id: string) => {
    const updatedSelected = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];

    setSelectedIds(updatedSelected);
    const selectedRows = tasks.filter((task) =>
      updatedSelected.includes(task._id)
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

  const currentData = tasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = currentData.map((task) => task._id);
      setSelectedIds(newSelected);
      console.log("Selected Rows:", currentData);
    } else {
      setSelectedIds([]);
    }
  };

  return (
    <Box p={2}>
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ color: "#8D8883" }}>
                <Checkbox
                  checked={
                    currentData.length > 0 &&
                    currentData.every((row) => selectedIds.includes(row._id))
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
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography>No tasks available.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((task) => (
                <TableRow key={task._id}>
                  <TableCell padding="checkbox" sx={{ borderBottom: "none" }}>
                    <Checkbox
                      checked={selectedIds.includes(task._id)}
                      onChange={() => handleCheckboxChange(task._id)}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "none",
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Tooltip title={task.taskName}>
                      <span
                        style={{
                          display: "inline-block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "100%",
                        }}
                        className="hover:cursor-pointer"
                      >
                        {task.taskName}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {task.assignedBy?.email || "Unassigned"}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {task.assignedBy?.email || "Unassigned"}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {task.status}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                                    <Typography 
                                      sx={{ color: task.priority === "High" ? "red" : task.priority === "Medium" ? "orange" : "green" }}
                                    >
                                      {task.priority}
                                    </Typography>
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={tasks.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default TaskManagementTable;
