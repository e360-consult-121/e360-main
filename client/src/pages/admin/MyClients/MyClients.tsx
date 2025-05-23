import { useEffect, useState } from "react";
import { useAddNewClientMutation, useFetchAllClientsQuery } from "../../../features/admin/myClients/myClientsApi"
import ClientsTable from "./ClientsTable"
import { CircularProgress } from "@mui/material";

const MyClients = () => {

    const {data , isLoading ,isError,refetch} = useFetchAllClientsQuery(undefined);
    const [clientsData , setClientsData] = useState();
  // console.log(data)
    const [addNewClient] = useAddNewClientMutation();
    
    useEffect(() => {
    if (data && !isLoading && !isError) {
    setClientsData(data.data)
    }
  }, [data, isLoading, isError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 md:mt-[15%]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
        <ClientsTable data={clientsData} onAddClient={addNewClient} refetch={refetch}
/>
    </div>
  )
}

export default MyClients