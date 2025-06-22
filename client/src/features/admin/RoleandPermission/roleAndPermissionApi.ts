import { baseApi } from "../../../app/api";

export const roleAndPermissionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchAllAdminUsers: build.query({
      query: ({
        search = "",
        page = 1,
        limit = 10,
        sortBy = "name",
        order = "asc",
      }) => ({
        url: `/admin/rbac/fetchAllAdminUsers`,
        method: "GET",
        params: { search, page, limit, sortBy, order },
      }),
    }),
    fetchAllFeatures: build.query({
      query: () => ({
        url: `/admin/rbac/fetchAllFeatures`,
        method: "GET",
      }),
    }),
    fetchRoleWisePermissions: build.query({
      query: () => ({
        url: `/admin/rbac/fetchRoleWisePermissions`,
        method: "GET",
      }),
    }),
    fetchAllRoles: build.query({
      query: () => ({
        url: `/admin/rbac/fetchAllRoles`,
        method: "GET",
      }),
    }),
    addNewRole: build.mutation({
      query: (body) => ({
        url: `/admin/rbac/addNewRole`,
        method: "POST",
        data: body,
      }),
    }),
    editRoleName: build.mutation({
      query: ({ roleId, body }) => ({
        url: `/admin/rbac/editRoleName/${roleId}`,
        method: "PATCH",
        data: body,
      }),
    }),
    deleteRole: build.mutation({
      query: (roleId) => ({
        url: `/admin/rbac/deleteRole/${roleId}`,
        method: "DELETE",
      }),
    }),
    addNewAdminUser: build.mutation({
      query: ({ roleId, body }) => ({
        url: `/admin/rbac/addNewAdminUser/${roleId}`,
        method: "POST",
        data: body,
      }),
    }),
    assignActionsToRole: build.mutation({
      query: (body) => ({
        url: `/admin/rbac/assignActionsToRole`,
        method: "POST",
        data: body,
      }),
    }),
    editAdminUser: build.mutation({
      query: ({ employeeId, body }) => ({
        url: `/admin/rbac/editAdminUser/${employeeId}`,
        method: "PATCH",
        data: body,
      }),
    }),
    deleteAdminUser: build.mutation({
      query: (userId) => ({
        url: `/admin/rbac/deleteAdminUser/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchAllAdminUsersQuery,
  useFetchAllFeaturesQuery,
  useFetchRoleWisePermissionsQuery,
  useFetchAllRolesQuery,
  useAddNewRoleMutation,
  useAssignActionsToRoleMutation,
  useAddNewAdminUserMutation,
  useDeleteAdminUserMutation,
  useEditAdminUserMutation,
  useDeleteRoleMutation,
  useEditRoleNameMutation,
} = roleAndPermissionApi;
