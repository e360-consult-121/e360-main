import { useEffect, useState } from "react";
import {
  useAddNewClientMutation,
  useFetchAllClientsQuery,
} from "../../../features/admin/myClients/myClientsApi";
import ClientsTable from "./ClientsTable";
import { CircularProgress } from "@mui/material";
import { useSearchPagination } from "../../../features/searchPagination/useSearchPagination";

const MyClients = () => {
  const [searchPaginationState, searchPaginationActions] = useSearchPagination({
    initialLimit: 5,
  });

  // Additional local filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const { data, isLoading, isError, refetch } = useFetchAllClientsQuery({
    ...searchPaginationState,
    status: statusFilter,
    dateFilter: dateFilter,
  });

  const [clientsData, setClientsData] = useState();
  const [addNewClient] = useAddNewClientMutation();

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setClientsData(data.data);
    }
  }, [data, isLoading, isError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 mr-[20%] md:mr-0  mt-[40%] md:mt-[15%]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="ml-[-30px] md:ml-0">
      <ClientsTable
        data={clientsData}
        onAddClient={addNewClient}
        refetch={refetch}
        // Pass search/pagination state
        searchPaginationState={searchPaginationState}
        searchPaginationActions={searchPaginationActions}
        // Pass additional filters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        // Pass pagination info from API response
        pagination={data?.pagination}
      />
    </div>
  );
};

export default MyClients;
