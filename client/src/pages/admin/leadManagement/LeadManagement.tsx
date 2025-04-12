import { Box } from "@mui/material";
import LeadTable from "./LeadTable";
import { AllLeads } from "../../../features/admin/leadManagement/leadManagementTypes";
import { useFetchAllLeadsQuery } from "../../../features/admin/leadManagement/leadManagementApi";
import { useEffect, useState } from "react";


const LeadManagement: React.FC = () => {

  const { data, isLoading, isError } = useFetchAllLeadsQuery(undefined);
  const [leadData, setLeadData] = useState<AllLeads[]>([]);

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setLeadData(data.leads);
    }
  }, [data, isLoading, isError]);

  return (
    <Box
      sx={{
        px: 4,
      }}
    >
      <LeadTable
        data={leadData}
      />
    </Box>
  );
};

export default LeadManagement;
