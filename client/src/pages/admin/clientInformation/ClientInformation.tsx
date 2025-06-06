import {
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from "@mui/material";
import ClientConsultation from "./ClientConsultation";
import { useParams } from "react-router-dom";
import { useFetchParticularLeadQuery } from "../../../features/admin/leadManagement/leadManagementApi";
import { useEffect, useState } from "react";
import {
  ClientInfoType,
  leadStatus,
} from "../../../features/admin/leadManagement/leadManagementTypes";

const ClientInformation = () => {
  const { leadid } = useParams();
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
      <Card
        sx={{
          mx: 5,
          pl: 3,
          pr: 5,
          boxShadow: "none",
          bgcolor: "#F6F5F5",
          borderRadius: "15px",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Client Information
            </Typography>
            <Typography sx={{ fontSize: "14px" }}>
              <span className="text-[#F6C328]"> ● </span>
              {clientInfo?.leadStatus === leadStatus.INITIATED
                ? "Eligibility Form Under Review"
                : clientInfo?.leadStatus === leadStatus.CONSULTATIONLINKSENT ||
                  clientInfo?.leadStatus === leadStatus.CONSULTATIONSCHEDULED
                ? "Consultation Pending"
                : clientInfo?.leadStatus === leadStatus.CONSULTATIONDONE ||
                  clientInfo?.leadStatus === leadStatus.PAYMENTLINKSENT
                ? "Payment Pending"
                : clientInfo?.leadStatus === leadStatus.PAYMENTDONE
                ? "Payment Completed"
                : clientInfo?.leadStatus === leadStatus.REJECTED
                ? "Rejected"
                : ""}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography>Name: {clientInfo?.leadInfo?.name}</Typography>
              <Typography>
                Applied for: <strong>{clientInfo?.leadInfo?.appliedFor}</strong>
              </Typography>
              <Typography>Email: {clientInfo?.leadInfo?.email}</Typography>
            </Box>

            <Box>
              <Typography>Case ID: {clientInfo?.leadInfo?.caseId}</Typography>
              <Typography>Number: {clientInfo?.leadInfo?.phone}</Typography>
              {clientInfo?.paymentInfo?.status === "PAID" && (
                <Typography>
                  Payment Status:{" "}
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    Completed
                  </span>
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
      <ClientConsultation
        onRefreshLead={refetch}
        leadStatus={clientInfo?.leadStatus || ""}
        consultationInfo={clientInfo?.consultationInfo}
        paymentInfo={clientInfo?.paymentInfo}
        visaType={clientInfo?.leadInfo?.appliedFor??""}
        eligibilityForm={clientInfo?.eligibilityForm}
        formSubmisionDate={clientInfo?.leadInfo?.createdAt || ""}
        showExtraTabs={false}
      />
    </>
  );
};

export default ClientInformation;
