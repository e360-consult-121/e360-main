import { baseApi } from "../../../../app/api";

export const dubaiApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ___ Trade Name Apis ___

    fetchTradeInfo: build.query({
      query: ({ stepStatusId }) => ({
        url: `/visaApplications/common/${stepStatusId}/dubai/trade-name/fetchTradeNameInfo`,
        method: "GET",
      }),
    }),
    submitTradeNameOptions: build.mutation({
      query: ({ stepStatusId, options }) => ({
        url: `/visaApplications/client-side/${stepStatusId}/dubai/trade-name/uploadTradeNameOptions`,
        method: "POST",
        data: { options },
      }),
    }),
    assignOneTradename: build.mutation({
      query: ({ stepStatusId, assignedName }) => ({
        url: `/visaApplications/admin-side/${stepStatusId}/dubai/trade-name/assignOneTradeName`,
        method: "POST",
        data: { assignedName },
      }),
    }),
    requestTradenameChange: build.mutation({
      query: ({ stepStatusId, options, reasonOfChange }) => ({
        url: `/visaApplications/client-side/${stepStatusId}/dubai/trade-name/sendChangeRequest`,
        method: "POST",
        data: { options, reasonOfChange },
      }),
    }),
    approveChangeRequest: build.mutation({
      query: ({ stepStatusId, assignedName }) => ({
        url: `/visaApplications/admin-side/${stepStatusId}/dubai/trade-name/approveChangeReq`,
        method: "POST",
        data: { assignedName },
      }),
    }),
    rejectChangeRequest: build.mutation({
      query: ({ stepStatusId }) => ({
        url: `/visaApplications/admin-side/${stepStatusId}/dubai/trade-name/rejectChangeReq`,
        method: "POST",
      }),
    }),

    // ______ MOA Apis _______

    fetchMoaInfo: build.query({
      query: ({ stepStatusId }) => ({
        url: `/visaApplications/common/${stepStatusId}/dubai/moa/fetchSigAndMOA`,
        method: "GET",
      }),
    }),
    uploadMoa: build.mutation({
      query: ({ stepStatusId, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/visaApplications/admin-side/${stepStatusId}/dubai/MOA/moaUpload`,
          method: "POST",
          data: formData,
          formData: true,
        };
      },
    }),
    uploadSignature: build.mutation({
      query: ({ stepStatusId, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/visaApplications/client-side/${stepStatusId}/dubai/MOA/uploadSignature`,
          method: "POST",
          data: formData,
          formData: true,
        };
      },
    }),


    // Medical Appointment Apis
    

  }),
});

export const {
  // Trade Name
  useFetchTradeInfoQuery,
  useSubmitTradeNameOptionsMutation,
  useAssignOneTradenameMutation,
  useRequestTradenameChangeMutation,
  useApproveChangeRequestMutation,
  useRejectChangeRequestMutation,

  //   Moa
  useFetchMoaInfoQuery,
  useUploadMoaMutation,
  useUploadSignatureMutation,
} = dubaiApis;
