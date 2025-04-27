import  { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import TableComponent from "./TableComponent"; // adjust the path
import { useFetchParticularVisaApplicationQuery } from "../../../features/admin/visaApplication/visApplicationApi";
import { useParams } from "react-router-dom";

const VisaService = () => {
  const [applications, setApplications] = useState([]);
  const {type} = useParams();
  
  const visaType = type ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() : '';

  const { data, isLoading, isError } = useFetchParticularVisaApplicationQuery(visaType);

  useEffect(() => {
    console.log(data)
    if (data && !isLoading && !isError) {
      setApplications(data.visaApplications);
    }
  }, [data, isLoading, isError,visaType]);

  return (
    <Box sx={{ px: 4, py: 2 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error" align="center" mt={4}>
          Something went wrong while fetching data.
        </Typography>
      ) : (
        <TableComponent data={applications} />
      )}
    </Box>
  );
};

export default VisaService;
