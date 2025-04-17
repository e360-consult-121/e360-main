import { Box } from "@mui/material";
import ConsultationsTable from "./ConsultationsTable";
import { useFetchAllConsultationsQuery } from "../../../features/admin/consultations/consultationApi";
import { useEffect, useState } from "react";
import { AllConsultationsTypes } from "../../../features/admin/consultations/consultationTypes";

const Consultations = () => {

  const { data, isLoading, isError } = useFetchAllConsultationsQuery(undefined);

  const [consultationData,setConsultationData] = useState<AllConsultationsTypes[]>()
   
  useEffect(() => {    
      if (data && !isLoading && !isError) {
        // console.log(data)
        setConsultationData(data.consultations);
      }
    }, [data, isLoading, isError]);


  // const handleJoinNow = (consultation: any) => {
  //   alert(`Joining consultation for ${consultation.name}`);
  // };

  // const handleReschedule = (consultation: any) => {
  //   alert(`Rescheduling consultation for ${consultation.name}`);
  // };

  return (
    <Box 
    sx={{
      px:4
    }}>
      <ConsultationsTable data={consultationData} 
      // onJoinNow={handleJoinNow} 
      // onReschedule={handleReschedule} 
      />
    </Box>
  );
};

export default Consultations;
