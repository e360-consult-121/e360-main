import { baseApi } from "../../../app/api";

export const myClientsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchAllClients: build.query({
      query: () => ({
        url: `/admin/clientsInfo/fetchAllClients`,
        method: "GET",
      }),
    }),
    fetchClientVisaApplications: build.query({
      query: (userid) => ({
        url: `/admin/clientsInfo/fetchClientVisaApplications/${userid}`,
        method: "GET",
      }),
    }),
    addNewClient: build.mutation({
      query: (data) => ({
        url: `/admin/adminControl/addNewClient`,
        method: "POST",
        data:data
      }),
    }),
  }),
});

export const { useFetchAllClientsQuery,useAddNewClientMutation,useFetchClientVisaApplicationsQuery } = myClientsApi;
