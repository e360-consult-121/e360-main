import { baseApi } from "../../../app/api";

export const roleAndPermissionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchAllAdminUsers: build.query({
      query: () => ({
        url: `/admin/rbac/fetchAllAdminUsers`,
        method: "GET",
      }),
    }),
    fetchAllFeatures: build.query({
      query: () => ({
        url: `/admin/rbac/fetchAllFeatures`,
        method: "GET",
      }),
    }),
  }),
});

export const { useFetchAllAdminUsersQuery , useFetchAllFeaturesQuery} = roleAndPermissionApi;
