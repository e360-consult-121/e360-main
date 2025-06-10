import { baseApi } from "../../../app/api";

export const taskManagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchAllTasks: build.query({
      query: () => ({
        url: "/admin/task-management/fetchAllTasks",
        method: "GET",
      }),
    }),
    fetchMyTasks: build.query({
      query: () => ({
        url: "/admin/task-management/fetchMyTasks",
        method: "GET",
      }),
    }),
    fetchUpcomingTasks: build.query({
      query: () => ({
        url: "/admin/task-management/fetchUpcomingTasks",
        method: "GET",
      }),
    }),
    fetchDueTasks: build.query({
      query: () => ({
        url: "/admin/task-management/fetchDueTasks",
        method: "GET",
      }),
    }),
    fetchOverdueTasks: build.query({
      query: () => ({
        url: "/admin/task-management/fetchOverdueTasks",
        method: "GET",
      }),
    }),
   addNewTask: build.mutation({
  query: ({ file, body }) => {
    const formData = new FormData();
    formData.append("taskName", body.taskName);
    formData.append("description", body.description);
    formData.append("priority", body.priority);
    formData.append("startDate", body.startDate);
    formData.append("endDate", body.endDate);

    if (body.attachedLead)
      formData.append("attachedLead", body.attachedLead);

    if (body.attchedVisaApplication)
      formData.append("attchedVisaApplication", body.attchedVisaApplication);

    formData.append("assignedTo", body.assignedTo);
    
    if (file) {
      formData.append("file", file);
    }

    return {
      url: "/admin/task-management/addNewTask",
      method: "POST",
      data: formData,
    };
  },
}),
    fetchAssigneeList: build.query({
      query: () => ({
        url: "/admin/task-management/fetchAssigneeList",
        method: "GET",
      }),
    }),
    fetchAllVisaApplications: build.query({
      query: () => ({
        url: "/admin/task-management/fetchAllVisaApplications",
        method: "GET",
      }),
    }),
    fetchParticularTask: build.query({
      query: () => ({
        url: "/admin/task-management/fetchParticularTask",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useFetchAllTasksQuery,
  useFetchDueTasksQuery,
  useFetchMyTasksQuery,
  useFetchOverdueTasksQuery,
  useFetchUpcomingTasksQuery,
  useFetchAllVisaApplicationsQuery,
  useFetchAssigneeListQuery,
  useAddNewTaskMutation,
  useFetchParticularTaskQuery,
} = taskManagementApi;
