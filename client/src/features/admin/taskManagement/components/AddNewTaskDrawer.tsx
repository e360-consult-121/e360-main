import {
  Box,
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import { MultiSelect } from "react-multi-select-component";

const assigneeOptions = [
  { label: "Alice", value: "alice", role: "Manager" },
  { label: "Bob", value: "bob", role: "Staff" },
  { label: "Charlie", value: "charlie", role: "Staff" },
];
const leadOptions = [
  { label: "Lead A", value: "leadA" },
  { label: "Lead B", value: "leadB" },
  { label: "Lead C", value: "leadC" },
];
const applicationOptions = [
  { label: "Application A", value: "ApplicationA" },
  { label: "Application B", value: "ApplicationB" },
  { label: "Application C", value: "ApplicationC" },
];

const AddNewTaskDrawer = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const today = dayjs().format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState([]);
  const [lead, setLead] = useState([]);
  const [application, setApplication] = useState([]);
  const [media, setMedia] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddTask = () => {
    console.log({
      taskName,
      description,
      priority,
      startDate,
      endDate,
      assignee,
      lead,
      application,
      media,
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 550, padding: 3 } }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Add New Task
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box component="form" display="flex" flexDirection="column" gap={2}>
        <TextField
          fullWidth
          label="Enter Task Name*"
          variant="outlined"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <TextField
          fullWidth
          label="Description*"
          variant="outlined"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box sx={{ p: 1, borderRadius: 1 }}>
          <Typography>Priority*</Typography>

          <Box display="flex" gap={2} my={2}>
            {["Low", "Medium", "High"].map((level) => {
              const isSelected = priority === level;

              const getStyles = () => {
                switch (level) {
                  case "Low":
                    return {
                      backgroundColor: isSelected ? "#E4F2E5" : "#FFFEFE",
                      color: isSelected ? "#64AF64" : "black",
                      border: `1px solid ${isSelected ? "#64AF64" : "#ccc"}`,
                    };
                  case "Medium":
                    return {
                      backgroundColor: isSelected ? "#FFF8EC" : "#FFFEFE",
                      color: isSelected ? "#FEC95D" : "black",
                      border: `1px solid ${isSelected ? "#FEC95D" : "#ccc"}`,
                    };
                  case "High":
                    return {
                      backgroundColor: isSelected ? "#FFEAEF" : "#FFFEFE",
                      color: isSelected ? "#F5584D" : "black",
                      border: `1px solid ${isSelected ? "#F5584D" : "#ccc"}`,
                    };
                  default:
                    return {};
                }
              };

              return (
                <Box
                  key={level}
                  onClick={() => setPriority(level)}
                  sx={{
                    px: 4,
                    py: 2,
                    borderRadius: "15px",
                    cursor: "pointer",
                    textAlign: "center",
                    flex: 1,
                    ...getStyles(),
                  }}
                >
                  {level}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="Start Date*"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (endDate && e.target.value > endDate) {
                setEndDate("");
              }
            }}
          />
          <TextField
            fullWidth
            label="End Date*"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            inputProps={{ min: startDate }}
          />
        </Box>

       <Box>
      <Typography mb={1}>Assigned To*</Typography>
      <MultiSelect
        options={assigneeOptions}
        value={assignee}
        onChange={setAssignee}
        labelledBy="Select Assignees"
        overrideStrings={{
          selectSomeItems: "Select Assignees...",
        }}
        ItemRenderer={({ checked, option, onClick }:{checked:any, option:any, onClick:any}) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px",
              cursor: "pointer",
              backgroundColor: checked ? "#f9f9f9" : "white",
              borderBottom: "1px solid #eee",
            }}
            onClick={onClick}
          >
            <div>
              <input
              type="checkbox"
              checked={checked}
              onChange={onClick}
              style={{ marginRight: "8px" }}
            />
            <span>{option.label}</span>
            </div>
             <Box
              sx={{
                ml:1,
                padding: "2px 6px",
                borderRadius: "12px",
                fontSize: "12px",
                color: "white",
                backgroundColor:
                  option.role === "Manager" ? "#1976d2" : "#43a047",
                marginRight: "8px",
              }}
            >
              {option.role}
            </Box>
          </div>
        )}
      />
    </Box>

        <Box sx={{
        display:"flex",
        justifyContent:"space-between",
        gap:1
        }}>
          <Box minWidth={"230px"}>
            <Typography mb={1}>Attach Lead*</Typography>
            <MultiSelect
              options={leadOptions}
              value={lead}
              onChange={setLead}
              labelledBy="Select Leads"
              overrideStrings={{
                selectSomeItems: "Select Leads...",
              }}
            />
          </Box>

          <Box minWidth={200}>
            <Typography mb={1}>Attach Application</Typography>
            <MultiSelect
              options={applicationOptions}
              value={application}
              onChange={setApplication}
              labelledBy="Select Applications"
              overrideStrings={{
                selectSomeItems: "Select Applications...",
              }}
            />
          </Box>
        </Box>

        <Box
          p={2}
          border="1px dashed #ccc"
          borderRadius="12px"
          textAlign="center"
          sx={{ cursor: "pointer" }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Typography mb={1}>Attach Media</Typography>
          <Typography color="text.secondary" fontSize="14px">
            Upload media/Documents
          </Typography>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setMedia(e.target.files?.[0] || null)}
            style={{ display: "none" }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 8,
              width: "48%",
              textTransform: "none",
              borderColor: "black",
              color: "black",
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
              boxShadow: "none",
            }}
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddNewTaskDrawer;
