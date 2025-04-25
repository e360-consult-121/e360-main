import { baseApi } from "../../../app/api";

export const visaApplicationInformationApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      //Fetch customers current visa application step  informationa and  requirements
      getCurrentStepInfo: build.query({
        query: (visaApplicationId) => ({
          url: `visaApplications/client-side/${visaApplicationId}/getCurrentStepInfo`,
          method: "GET"
        }),
      }),
      approveStep: build.mutation({
        query: (visaApplicationId) => ({
          url: `/visaApplications/admin-side/${visaApplicationId}/approveStep`,
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
    }),
  });
  

  export const {
    useGetCurrentStepInfoQuery,
    useApproveStepMutation,
    useRejectStepMutation,
    useMarkAsVerifiedMutation,
    useNeedsReUploadMutation,
  } = visaApplicationInformationApi;
  
