import { baseApi } from "../../../app/api";



export const documentVaultApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      fetchVaultDocs: build.query({
        query: (visaApplicationId) => ({
          url: `/visaApplications/common/${visaApplicationId}/fetchVaultDocS`,
          method: "GET",
        }),
      }), 
    })
})

export const {useFetchVaultDocsQuery} =  documentVaultApi;