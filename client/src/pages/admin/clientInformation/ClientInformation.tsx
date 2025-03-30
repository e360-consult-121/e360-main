import { Typography, Card, CardContent, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import ClientConsultation from "./ClientConsultation";


const ClientInformation= () => {
  const location = useLocation();
  const clientInfo = location.state?.row;
  
  return (
    <>
    <Card sx={{ mx:5,pl:3, pr:5 , boxShadow:"none",bgcolor:"#F6F5F5",borderRadius:"15px" }}>
      <CardContent>
        <Box
        sx={{
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between"
        }}
        >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Client Information
        </Typography>
        <Typography sx={{
          fontSize:"14px"
        }}><span className="text-[#F6C328]"> ● </span>  Eligibility Form Under Review</Typography>
        </Box>

        <Box
        sx={{
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between"
        }}
        >
          <Box>
          <Typography>Name: {clientInfo.name}</Typography>
          <Typography>Email: {clientInfo.email}</Typography>
          <Typography>Applied for: Dominica Passport</Typography>
          </Box>

          <Box>
          <Typography>Case ID: {clientInfo.CaseID}</Typography>
          <Typography>Number: {clientInfo.phone}</Typography>
          <Typography>Payment Status: </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
    <ClientConsultation/>
    </>
  );
};

export default ClientInformation;
