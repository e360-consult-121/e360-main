import { baseApi } from "../../../app/api";

export const invoicesManagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchAllInvoices: build.query({
      query: ({ page = 1, limit = 5, search = "", statusFilter = "" }) => ({
        url: `/admin/invoices/fetchAllInvoices`,
        params: {
          page,
          limit,
          search: encodeURIComponent(search),
          statusFilter: encodeURIComponent(statusFilter),
        },
        method: "GET",
      }),
    }),
    fetchInvoicesStats: build.query({
      query: () => ({
        url: `/admin/invoices/fetchInvoicesStats`,
        method: "GET",
      }),  
    }), 
  }),
});

export const { useFetchAllInvoicesQuery,useFetchInvoicesStatsQuery } = invoicesManagementApi;
