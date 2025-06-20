import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import TaskManagementTable from "../../../features/admin/taskManagement/components/TaskManagementTable";
import AddNewTaskDrawer from "../../../features/admin/taskManagement/components/AddNewTaskDrawer";

import {
  useFetchAllTasksQuery,
  useFetchMyTasksQuery,
  useFetchUpcomingTasksQuery,
  useFetchDueTasksQuery,
  useFetchOverdueTasksQuery,
} from "../../../features/admin/taskManagement/taskManagementApi";

const TaskManagment = () => {
  const [employeeDrawerOpen, setEmployeeDrawerOpen] = useState(false);
  const [tab, setTab] = useState("alltasks");

  const {
    data: allTasks,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    refetch:refetchAllTasks
  } = useFetchAllTasksQuery({refetchOnMountOrArgChange: true},
 { skip: tab !== "alltasks" });

  const {
    data: myTasks,
    isLoading: isLoadingMy,
    isError: isErrorMy,
    refetch:refetchMyTasks
  } = useFetchMyTasksQuery(undefined, { skip: tab !== "mytasks" });

  const {
    data: upcomingTasks,
    isLoading: isLoadingUpcoming,
    isError: isErrorUpcoming,
    refetch:refetchUpcomingTasks
  } = useFetchUpcomingTasksQuery(undefined, { skip: tab !== "upcomingtasks" });

  const {
    data: dueTasks,
    isLoading: isLoadingDue,
    isError: isErrorDue,
    refetch:refetchDueTasks
  } = useFetchDueTasksQuery(undefined, { skip: tab !== "duetasks" });

  const {
    data: overdueTasks,
    isLoading: isLoadingOverdue,
    isError: isErrorOverdue,
    refetch:refetchOverdueTasks
  } = useFetchOverdueTasksQuery(undefined, { skip: tab !== "overdue" });

  const taskTabs = [
    {
      label: "All Tasks",
      value: "alltasks",
      component: isLoadingAll ? (
        <div className="ml-[45%] mt-[15%]"><CircularProgress/></div>
      ) : isErrorAll || !allTasks?.tasks ? (
        <Typography color="error">Failed to load tasks.</Typography>
      ) : (
        <TaskManagementTable tasks={allTasks.tasks} refetchTasks={refetchAllTasks} />
      ),
      visible: true,
    },
    {
      label: "My Tasks",
      value: "mytasks",
      component: isLoadingMy ? (
        <div className="ml-[45%] mt-[15%]"><CircularProgress/></div>
      ) : isErrorMy || !myTasks?.tasks ? (
        <Typography color="error">Failed to load tasks.</Typography>
      ) : (
        <TaskManagementTable tasks={myTasks.tasks} refetchTasks={refetchMyTasks} />
      ),
      visible: true,
    },
    {
      label: "Upcoming Tasks",
      value: "upcomingtasks",
      component: isLoadingUpcoming ? (
        <div className="ml-[45%] mt-[15%]"><CircularProgress/></div>
      ) : isErrorUpcoming || !upcomingTasks?.tasks ? (
        <Typography color="error">Failed to load tasks.</Typography>
      ) : (
        <TaskManagementTable tasks={upcomingTasks.tasks} refetchTasks={refetchUpcomingTasks}/>
      ),
      visible: true,
    },
    {
      label: "Due Tasks",
      value: "duetasks",
      component: isLoadingDue ? (
        <div className="ml-[45%] mt-[15%]"><CircularProgress/></div>
      ) : isErrorDue || !dueTasks?.tasks ? (
        <Typography color="error">Failed to load tasks.</Typography>
      ) : (
        <TaskManagementTable tasks={dueTasks.tasks} refetchTasks={refetchDueTasks}/>
      ),
      visible: true,
    },
    {
      label: "Overdue",
      value: "overdue",
      component: isLoadingOverdue ? (
        <div className="ml-[45%] mt-[15%]"><CircularProgress/></div>
      ) : isErrorOverdue || !overdueTasks?.tasks ? (
        <Typography color="error">Failed to load tasks.</Typography>
      ) : (
        <TaskManagementTable tasks={overdueTasks.tasks} refetchTasks={refetchOverdueTasks}/>
      ),
      visible: true,
    },
  ];

  const visibleTabs = taskTabs.filter((tab) => tab.visible);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const activeTab = taskTabs.find((t) => t.value === tab);

  return (
    <div className="ml-[-30px] md:ml-0 md:px-3">
 <Box
  sx={{
    borderBottom: 1,
    borderColor: "divider",
    mb: 2,
    position: "relative",
    overflowX: "auto",
  }}
>
  <Tabs
    value={tab}
    onChange={handleChange}
    textColor="primary"
    indicatorColor="primary"
    variant="scrollable"
    scrollButtons="auto"
    allowScrollButtonsMobile
    TabScrollButtonProps={{
      sx: {
        "&.Mui-disabled": {
          opacity: 0.3,
        },
      },
    }}
    sx={{
      ".MuiTabs-scrollButtons": {
        display: "flex",
        width: "40px",
      },
    }}
  >
    {visibleTabs.map(({ label, value }) => (
      <Tab
        key={value}
        label={label}
        value={value}
        sx={{ textTransform: "none", minWidth: "max-content" }}
      />
    ))}
  </Tabs>
</Box>



      <Box display="flex" justifyContent="end" alignItems="center">
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
          Add New Task
        </Button>
      </Box>
      

      {activeTab?.component}

      <AddNewTaskDrawer
        refetchAllTasks = {refetchAllTasks}
        open={employeeDrawerOpen}
        onClose={() => setEmployeeDrawerOpen(false)}
      />
    </div>
  );
};

export default TaskManagment;
