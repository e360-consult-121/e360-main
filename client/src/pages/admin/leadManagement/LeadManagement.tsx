import { Box, CircularProgress } from "@mui/material";
import LeadTable from "./LeadTable";
import { AllLeads } from "../../../features/admin/leadManagement/leadManagementTypes";
import { useFetchAllLeadsQuery } from "../../../features/admin/leadManagement/leadManagementApi";
import { useEffect, useState } from "react";

const LeadManagement: React.FC = () => {
  const { data, isLoading, isError } = useFetchAllLeadsQuery(undefined);
  const [leadData, setLeadData] = useState<AllLeads[]>([]);

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setLeadData(data.leads ?? []);
    }
  }, [data, isLoading, isError]);

  return (
    <Box
      sx={{
        ml: { xs: "-25px", md: 0 },
        px: { md: 4 },
        // display: "flex",
        // justifyContent: isLoading ? "center" : "flex-start",
        // alignItems: isLoading ? "center" : "stretch",
      }}
    >
      {isLoading ? (
        <Box sx={{mt:{xs:"70%",md:"25%"}, ml:{xs:"40%",md:"45%"}}}>
          <CircularProgress />
        </Box>
      ) : (
        <LeadTable data={leadData} />
      )}
    </Box>
  );
};

export default LeadManagement;
