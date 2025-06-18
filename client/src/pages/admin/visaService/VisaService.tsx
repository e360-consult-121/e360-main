import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import TableComponent from "./TableComponent";
import {
  useFetchAllStepsOfParticularVisaTypeQuery,
  useFetchParticularVisaApplicationQuery,
} from "../../../features/admin/visaApplication/visApplicationApi";
import { useParams } from "react-router-dom";

const VisaService = () => {
  const [applications, setApplications] = useState([]);
  const [steps, setSteps] = useState([]); // new state for steps data
  const { type } = useParams();

  const visaType = type
    ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    : "";

  const {
    data,
    isLoading,
    isError,
  } = useFetchParticularVisaApplicationQuery(visaType);

  const {
    data: stepsData,
    isLoading: stepsLoading,
    isError: stepsError,
  } = useFetchAllStepsOfParticularVisaTypeQuery(visaType);

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setApplications(data.visaApplications);
    }
  }, [data, isLoading, isError, visaType]);

  // console.log(data);
  useEffect(() => {
    if (stepsData && !stepsLoading && !stepsError) {
      setSteps(stepsData.stepNames);
    }
  }, [stepsData, stepsLoading, stepsError, visaType]);

  const isAnyLoading = isLoading || stepsLoading;
  const isAnyError = isError || stepsError;

  return (
    <Box sx={{ ml:{xs:"-30px",md:0}, px:{ md:4}, py: {md:2} }}>
      {isAnyLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt:{ xs:"70%", md:"25%"} }}>
          <CircularProgress />
        </Box>
      ) : isAnyError ? (
        <Typography color="error" align="center" mt={4}>
          Something went wrong while fetching data.
        </Typography>
      ) : (
        <TableComponent data={applications} stepsData={steps} />
      )}
    </Box>
  );
};

export default VisaService;
