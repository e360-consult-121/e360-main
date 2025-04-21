import { baseApi } from "../../../app/api";

export const visaApplicationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchParticularVisaApplication: build.query({
      // Accept visaType as an argument
      query: (visaType) => ({
        url: `/admin/visaapplication/fetchParticularVisaApplication?visaType=${visaType}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useFetchParticularVisaApplicationQuery } = visaApplicationApi;
