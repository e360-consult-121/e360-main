import { useLocation } from "react-router-dom";
import { useFetchParticularLeadQuery } from "../../../features/admin/leadManagement/leadManagementApi";
import { ClientInfoType } from "../../../features/admin/leadManagement/leadManagementTypes";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ClientConsultation from "../clientInformation/ClientConsultation";
import ClientInfoCard from "../../../components/admin/ClientInfoCard";

const VisaApplicationInformation = () => {

    const location = useLocation();
    // console.log(location);
    const row = location.state?.row;
    const leadid = row.leadId 
    // const { visatype } = useParams();
    const { data, isLoading, isError,refetch } = useFetchParticularLeadQuery(leadid);
    const [clientInfo, setClientInfo] = useState<ClientInfoType>();
  
    useEffect(() => {
      if (data && !isLoading && !isError) {
        // console.log(data.data)
        setClientInfo(data.data);
      }
    }, [data, isLoading, isError]);
  
    if (isLoading) {
      return( 
        <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
      )
      
    }
  
    if (isError || !data) {
      return (
      <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
      >
      <Typography color="error">Failed to load client data.</Typography>
      </Box>
      )
    }
  
    return (
      <>
        <ClientInfoCard clientInfo={clientInfo} />
        <ClientConsultation
          onRefreshLead={refetch}
          leadStatus={clientInfo?.leadStatus || ""}
          consultationInfo={clientInfo?.consultationInfo}
          paymentInfo={clientInfo?.paymentInfo}
          eligibilityForm={clientInfo?.eligibilityForm}
          visaType={clientInfo?.leadInfo?.appliedFor ?? ""}
          formSubmisionDate={clientInfo?.leadInfo?.createdAt || ""}
          showExtraTabs={true}
        />
      </>
    );
}

export default VisaApplicationInformation