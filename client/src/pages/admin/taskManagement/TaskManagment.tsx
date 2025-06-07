import { Box, Button, MenuItem, Select, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import TaskManagementTable from "../../../features/admin/taskManagement/components/TaskManagementTable";
import AddNewTaskDrawer from "../../../features/admin/taskManagement/components/AddNewTaskDrawer";

// const MyTasks = () => <div>My Tasks Content</div>;
// const UpcomingTasks = () => <div>Upcoming Tasks Content</div>;
// const DueTasks = () => <div>Due Tasks Content</div>;
// const OverdueTasks = () => <div>Overdue Tasks Content</div>;

const taskTabs = [
  {
    label: "All Tasks",
    value: "alltasks",
    component: <TaskManagementTable />,
    visible: true,
  },
  {
    label: "My Tasks",
    value: "mytasks",
    // component: <MyTasks />,
    component: <TaskManagementTable />,
    visible: true,
  },
  {
    label: "Upcoming Tasks",
    value: "upcomingtasks",
    // component: <UpcomingTasks />,
    component: <TaskManagementTable />,
    visible: true,
  },
  {
    label: "Due Tasks",
    value: "duetasks",
    // component: <DueTasks />,
    component: <TaskManagementTable />,
    visible: true,
  },
  {
    label: "Overdue",
    value: "overdue",
    // component: <OverdueTasks />,
    component: <TaskManagementTable />,
    visible: true,
  },
];

const TaskManagment = () => {
  const visibleTabs = taskTabs.filter((tab) => tab.visible);
//   const [sortBy, setSortBy] = useState("");
  const [employeeDrawerOpen, setEmployeeDrawerOpen] = useState(false);
  const [tab, setTab] = useState(visibleTabs[0]?.value || "");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  }

  const activeTab = taskTabs.find((t) => t.value === tab);

  return (
    <div className="px-5">
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
        >
          {visibleTabs.map(({ label, value }) => (
            <Tab
              key={value}
              label={label}
              value={value}
              sx={{ textTransform: "none" }}
            />
          ))}
        </Tabs>
      </Box>
      {/* Header Controls */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Select
        //   value={sortBy}
        //   onChange={handleSortChange}
          displayEmpty
          size="small"
        >
          <MenuItem value="Sort">Sort By</MenuItem>
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
          Add New Task
        </Button>
      </Box>
      {activeTab?.component}
      <AddNewTaskDrawer
      open={employeeDrawerOpen}
      onClose={() => setEmployeeDrawerOpen(false)}
      />
    </div>
  );
};

export default TaskManagment;
