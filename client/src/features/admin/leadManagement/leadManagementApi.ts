import { baseApi } from "../../../app/api";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchAllLeads:build.query({
        query:() => ({
            url:"/leads/fetchAllLeads",
            method:"GET"
        }),
    }),
    





  })

})