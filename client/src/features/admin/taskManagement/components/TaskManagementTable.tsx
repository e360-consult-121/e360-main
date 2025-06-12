import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  Paper,
  Stack,
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
import { useDeleteTaskMutation, useEditTaskMutation } from "../taskManagementApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const TaskManagementTable = ({
  tasks,
  refetchTasks,
}: {
  tasks: any[];
  refetchTasks: () => void;
}) => {
  // console.log(tasks);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const navigate = useNavigate();

  const [deleteTask] = useDeleteTaskMutation();
  const [editTask] = useEditTaskMutation();

  const handleDeleteTask = async (taskId: string) => {
    try {
      setDeletingTaskId(taskId);
      await deleteTask(taskId).unwrap();
      toast.success("Task deleted successfully");
      refetchTasks();
    } catch (err) {
      toast.error("Failed to delete task");
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleTaskComplete = async(taskid:string)=> {
    try {
      const body = {
        status:"Completed"
      }
      await editTask({taskId:taskid,body}).unwrap();
      toast.success("Marked as completed");
      refetchTasks();
    } catch (err) {
      toast.error("Something went wrong")
    }
  }

  const handleparticularTaskNavigation = (taskId: string) => {
    navigate(`/admin/taskmanagement/${taskId}`);
  };

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
                <TableRow
                  key={task._id}
                  sx={{
                    opacity: deletingTaskId === task._id ? 0.5 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                >
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
                    {Array.isArray(task.assignedTo) &&
                    task.assignedTo.length > 0 ? (
                      <Stack direction="column" spacing={1} flexWrap="wrap">
                        {task.assignedTo.map((user: any) => (
                          <Tooltip title={user.email} key={user._id}>
                            <Chip
                              label={user.email}
                              size="small"
                              sx={{
                                maxWidth: 150,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            />
                          </Tooltip>
                        ))}
                      </Stack>
                    ) : (
                      "Unassigned"
                    )}
                  </TableCell>

                  <TableCell sx={{ borderBottom: "none" }}>
                    {task.assignedBy?.email || "Unassigned"}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none",
                    color:
                          task.status === "Completed"
                            ? "green"
                            : task.status === "Due"
                            ? "orange"
                            : "red",
                   }}>
                    {task.status}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <Typography
                      sx={{
                        color:
                          task.priority === "High"
                            ? "red"
                            : task.priority === "Medium"
                            ? "orange"
                            : "green",
                      }}
                    >
                      {task.priority}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <IconButton
                    disabled={task.status === "Completed"}
                    onClick={()=> handleTaskComplete(task._id)}
                    >
                      <AssignmentTurnedInIcon sx={{color:task.status === "Completed" ? "green":"gray"}}/>
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                     <Button
                      sx={{
                        color:"black",
                        textTransform:"none"
                      }}
                      onClick={() => handleparticularTaskNavigation(task._id)}
                    >
                      View &gt;
                    </Button>
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
