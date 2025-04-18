import { Box, Typography, CircularProgress } from "@mui/material";
import ConsultationsTable from "./ConsultationsTable";
import { useFetchAllConsultationsQuery } from "../../../features/admin/consultations/consultationApi";
import { useEffect, useState } from "react";
import { AllConsultationsTypes } from "../../../features/admin/consultations/consultationTypes";

const Consultations = () => {
  const { data, isLoading, isError } = useFetchAllConsultationsQuery(undefined);
  const [consultationData, setConsultationData] = useState<AllConsultationsTypes[]>();

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setConsultationData(data.consultations);
    }
  }, [data, isLoading, isError]);

  return (
    <Box sx={{ px: 4 }}>
      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Typography color="error">Failed to load consultations.</Typography>
      ) : consultationData?.length ? (
        <ConsultationsTable data={consultationData} />
      ) : (
        <Typography variant="h6" color="textSecondary" align="center" mt={35}>
          No consultations found.
        </Typography>
      )}
    </Box>
  );
};

export default Consultations;
