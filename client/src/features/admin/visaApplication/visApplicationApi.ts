import { baseApi } from "../../../app/api";

export const visaApplicationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchParticularVisaApplication: build.query({
      query: ({ visaType, page = 1, limit = 5, search = "" }) => ({
        url: `/admin/visaapplication/fetchApplicationsOfParticularType?visaType=${visaType}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        method: "GET",
      }),
    }),
    fetchAllStepsOfParticularVisaType: build.query({
      query: (visaType) => ({
        url: `/admin/visaapplication/fetchAllStepsOfParticularVisaType?visaType=${visaType}`,
        method: "GET",
      }),
    }),
  }),
});

export const { 
  useFetchParticularVisaApplicationQuery,
  useFetchAllStepsOfParticularVisaTypeQuery 
} = visaApplicationApi;