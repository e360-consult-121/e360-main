import { baseApi } from "../../../app/api";

export const visaApplicationInformationApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      approveStep: build.mutation({
        query: (visaApplicationId) => ({
          url: `/visaApplications/common/${visaApplicationId}/approveStep`,
          method: "POST",
        }),
      }),
      rejectStep: build.mutation({
        query: (visaApplicationId) => ({
          url: `/visaApplications/admin-side/${visaApplicationId}/rejectStep`,
          method: "POST",
        }),
      }),
      markAsVerified: build.mutation({
        query: (reqStatusId) => ({
          url: `/visaApplications/admin-side/${reqStatusId}/markAsVerified`,
          method: "POST",
        }),
      }),
      needsReUpload: build.mutation({
        query: ({ reqStatusId, reason }) => ({
            url: `/visaApplications/admin-side/${reqStatusId}/needsReupload`,
            method: "POST",
            body: { reason }
        }),
      }),
      addRealStateOptions: build.mutation({
        query: ({ stepStatusId ,  realStateOptions }) => ({
            url: `/visaApplications/admin-side/${stepStatusId}/addOptionsForRealState`,
            method: "POST",
            body: { realStateOptions }
        }),
      }),
      uploadShippingDetails: build.mutation({
        query: ({ stepStatusId ,data }) => ({
            url: `/visaApplications/admin-side/${stepStatusId}/uploadShippingDetails`,
            method: "POST",
            body: data 
        }),
      }),
    }),
  });
  

  export const {
    useUploadShippingDetailsMutation,
    useAddRealStateOptionsMutation,
    useApproveStepMutation,
    useRejectStepMutation,
    useMarkAsVerifiedMutation,
    useNeedsReUploadMutation,
  } = visaApplicationInformationApi;
  
