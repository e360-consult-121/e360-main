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
      query: ({file,data}) => {
        console.log(file,data);
        const formData = new FormData();
        formData.append("data", data);
        formData.append("file", file);
        return {
        url: `/admin/adminControl/addNewClient`,
        method: "POST",
        data:formData
      }},
    }),
  }),
});

export const { useFetchAllClientsQuery,useAddNewClientMutation,useFetchClientVisaApplicationsQuery } = myClientsApi;
