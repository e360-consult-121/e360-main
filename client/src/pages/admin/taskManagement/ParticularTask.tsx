import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Chip,
  Button,
  InputLabel,
  FormControl,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEditTaskMutation,
  useFetchAssigneeListQuery,
  useFetchParticularTaskQuery,
} from "../../../features/admin/taskManagement/taskManagementApi";
import dayjs from "dayjs";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";

const ParticularTask = () => {
  const { taskid } = useParams();
  const navigate = useNavigate();

  const [showMultiSelect, setShowMultiSelect] = useState(false);
  const [assignedTo, setAssignedTo] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [fileName, setFileName] = useState("File name");

  const { data, refetch } = useFetchParticularTaskQuery(taskid);
  const task = data?.data;
  const { data: allUsersData } = useFetchAssigneeListQuery(undefined);

  const [editTask] = useEditTaskMutation();

  const assigneeOptions =
  allUsersData?.data
    ?.filter((user: any) => !assignees.includes(user.email))
    .map((user: any) => ({
      label: user.email,
      value: user._id,
      role: user.role,
    })) || [];

  useEffect(() => {
    if (task) {
      setStatus(task.status || "");
      setAssignees(task.assignedTo?.map((user: any) => user.email) || []);
      setDescription(task.description || "");
    }
  }, [task]);

  const handleNavigation = () => {
    navigate("/admin/taskmanagement");
  };

  return (
    <Box px={4} width="100%" maxWidth="900px" mx="auto">
      <div className="flex justify-end">
        <IconButton onClick={handleNavigation}>
          <CloseIcon sx={{ color: "black" }} />
        </IconButton>
      </div>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={2}
      >
        <Typography variant="h5" fontWeight="bold">
          {task?.taskName || "Task Name"}
        </Typography>
        {/* <Button
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: "15px",
            boxShadow: "none",
          }}
          onClick={() => {
            console.log("Update clicked", { status, assignees, fileName });
          }}
        >
          Update
        </Button> */}
      </Box>

      <Typography variant="subtitle2" color="text.secondary" mb={3}>
        Assigned by - {task?.assignedBy?.name || "Admin/Manager"}
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={async (e) => {
            const newStatus = e.target.value;
            setStatus(newStatus);
            try {
              await editTask({ taskId: taskid, body: { status: newStatus } });
              toast.success("Status updated!");
              refetch();
            } catch (err) {
              toast.error("Failed to update status.");
            }
          }}
        >
          <MenuItem value="Over Due">Over Due</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Due">Due</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Description"
        placeholder="Description of the task"
        multiline
        rows={3}
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={async () => {
          try {
            await editTask({ taskId: taskid, body: { description } });
            toast.success("Task description updated");
            refetch();
          } catch (err) {
            toast.error("Failed to update description.");
          }
        }}
      />

      <Box display="flex" gap={4} mt={2}>
        <Box>
          <Typography fontWeight={500}>Lead</Typography>
          <Typography color="text.secondary">
            {task?.attachedLead || "N/A"}
          </Typography>
        </Box>
        <Box>
          <Typography fontWeight={500}>Application</Typography>
          <Typography color="text.secondary">
            {task?.attachedVisaApplication || "N/A"}
          </Typography>
        </Box>
      </Box>

      <Box mt={3}>
        <Typography fontWeight={500} mb={1}>
          Priority
        </Typography>
        <Box
          px={2}
          py={1}
          bgcolor={
            task?.priority === "High"
              ? "#FFEAEF"
              : task?.priority === "Medium"
              ? "#FEF8ED"
              : "#E5F2E4"
          }
          border="1px solid"
          borderColor={
            task?.priority === "High"
              ? "#F44336"
              : task?.priority === "Medium"
              ? "#FECF6F"
              : "#65AE64"
          }
          color={
            task?.priority === "High"
              ? "#F44336"
              : task?.priority === "Medium"
              ? "#FECF6F"
              : "#65AE64"
          }
          width="fit-content"
          borderRadius="8px"
        >
          {task?.priority || "N/A"}
        </Box>
      </Box>

      <Box mt={3}>
        <Typography fontWeight={500}>End Date</Typography>
        <Typography color="text.secondary">
          {task?.endDate
            ? dayjs(task.endDate).format("dddd, DD MMMM YYYY")
            : "N/A"}
        </Typography>
      </Box>

      <Box mt={3}>
        <Typography fontWeight={500} mb={1}>
          Assignee
        </Typography>

        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          {assignees.map((email, idx) => (
            <Tooltip key={idx} title={email}>
              <Chip
                label={email}
                onDelete={() =>
                  setAssignees(assignees.filter((_, i) => i !== idx))
                }
                sx={{ borderRadius: 2, maxWidth: 150 }}
              />
            </Tooltip>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              borderColor: "#D2D1CF",
              color: "black",
              bgcolor: "white",
            }}
            onClick={() => setShowMultiSelect(true)}
          >
            Add Assignee
          </Button>
        </Box>
        {showMultiSelect && (
          <Box>
            <MultiSelect
              options={assigneeOptions}
              value={assignedTo}
              onChange={async (selected: any) => {
                const selectedIds = selected.map((s: any) => s.value);
                setAssignedTo(selected);
                setAssignees(selectedIds);
                setShowMultiSelect(false);

                try {
                  await editTask({
                    taskId: taskid,
                    body: { assignedTo: selectedIds },
                  });
                  toast.success("Assignees updated!");
                  refetch();
                } catch (err) {
                  toast.error("Failed to update assignees.");
                }
              }}
              labelledBy="Select Assignees"
              overrideStrings={{
                selectSomeItems: "Select Assignees...",
              }}
              ItemRenderer={({
                checked,
                option,
                onClick,
              }: {
                checked: any;
                option: any;
                onClick: any;
              }) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={onClick}
                  >
                    <div>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={onClick}
                        style={{ marginRight: "12px" }}
                      />
                      <span>{option.label}</span>
                    </div>
                    {option.label !== "Select All" ? (
                      <Box
                        sx={{
                          ml: 1,
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color:
                            option.role === "Manager"
                              ? "#017BFF"
                              : option.role === "Staff"
                              ? "#31B0C6"
                              : "#8e24aa",
                          backgroundColor:
                            option.role === "Manager"
                              ? "#EFF7FF"
                              : option.role === "Staff"
                              ? "#ECF6F8"
                              : "#f3e5f5",
                          marginRight: "8px",
                        }}
                      >
                        {"• " + option.role}
                      </Box>
                    ) : null}
                  </div>
                );
              }}
            />
          </Box>
        )}
      </Box>

      <Box mt={4}>
        <Typography fontWeight={500} mb={1}>
          Attachments
        </Typography>
        {fileName && (
          <Box display="flex" alignItems="center" gap={1} width="fit-content">
            <Chip
              label={fileName}
              onDelete={() => setFileName("")}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        )}

        <Box
          mt={2}
          p={4}
          border="1px dashed #ccc"
          borderRadius="12px"
          textAlign="center"
          sx={{ cursor: "pointer" }}
        >
          <Typography color="text.secondary">Upload media/Documents</Typography>
        </Box>

        <Box sx={{ my: 5 }}>
          <Typography>Remarks :</Typography>
          <TextField
            fullWidth
            // label="Remarks"
            placeholder="Enter remarks of the task"
            multiline
            rows={3}
            margin="normal"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ParticularTask;
