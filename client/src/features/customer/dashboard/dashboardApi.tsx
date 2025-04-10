import { baseApi } from "../../../app/api";



export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      getApplications: build.query({
        query: () => ({
          url: "/user/visaapplication/application",
          method: "GET",
        }),
      }) 
    })
})

export const { useGetApplicationsQuery} =  dashboardApi;