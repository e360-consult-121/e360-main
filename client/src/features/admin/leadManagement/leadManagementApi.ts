import { baseApi } from "../../../app/api";

export const leadManagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchAllLeads: build.query({
      query: ({ page = 1, limit = 5, search = "", sort = "-createdAt" }) => ({
        url: `/admin/leads/fetchAllLeads?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}&sort=${sort}`,
        method: "GET",
      }),
    }),
    fetchParticularLead: build.query({
      query: (leadId) => ({
        url: `/admin/leads/${leadId}/fetchParticularLead`,
        method: "GET",
      }),
    }),
    rejectParticularLead: build.mutation({
      query: ({ leadid, body }) => ({
        url: `/admin/leads/${leadid}/rejectLead`,
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const {
  useFetchAllLeadsQuery,
  useFetchParticularLeadQuery,
  useRejectParticularLeadMutation,
} = leadManagementApi;
