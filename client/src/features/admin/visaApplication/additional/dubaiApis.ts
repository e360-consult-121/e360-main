import { baseApi } from "../../../../app/api";

export const portugalApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTradeInfo: build.query({
      query: ({stepStatusId}) => ({
        url: `/visaApplications/common/${stepStatusId}/dubai/trade-name/fetchTradeNameInfo`,
        method: "GET",
      }),
    }),
    submitTradeNameOptions: build.mutation({
      query: ({stepStatusId,options}) => ({
        url: `/visaApplications/client-side/${stepStatusId}/dubai/trade-name/uploadTradeNameOptions`,
        method: "POST",
        data: { options },
      }),
    }),
  }),
});

export const { useFetchTradeInfoQuery ,useSubmitTradeNameOptionsMutation} = portugalApi;
