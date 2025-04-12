import { baseApi } from "../../../app/api";

export const leadManagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchAllLeads:build.query({
        query:() => ({
            url:"/admin/leads/fetchAllLeads",
            method:"GET"
        }),
    }),
    fetchParticularLead: build.query({
      query: (leadId) => (
        {
        url: `/admin/leads/${leadId}/fetchParticularLead`,
        method: 'GET',
      }),
    }),
    rejectParticularLead: build.mutation({
      query: (leadId) => {
        console.log("Rejecting Lead ID:", leadId); // 👈 logs leadId when mutation is triggered
        return {
          url: `/admin/leads/${leadId}/rejectLead`,
          method: "POST",
        };
      },
    }),
  })
})

export const { useFetchAllLeadsQuery ,useFetchParticularLeadQuery ,useRejectParticularLeadMutation} = leadManagementApi;