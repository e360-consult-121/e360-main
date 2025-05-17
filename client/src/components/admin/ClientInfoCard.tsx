import { Card, CardContent, Typography, Box } from "@mui/material";

export enum LeadStatus {
  INITIATED = "INITIATED",
  CONSULTATIONLINKSENT = "CONSULTATIONLINKSENT",
  CONSULTATIONSCHEDULED = "CONSULTATIONSCHEDULED",
  CONSULTATIONDONE = "CONSULTATIONDONE",
  PAYMENTLINKSENT = "PAYMENTLINKSENT",
  PAYMENTDONE = "PAYMENTDONE",
  REJECTED = "REJECTED",
}

type LeadInfo = {
  name: string;
  appliedFor: string;
  email: string;
  caseId: string;
  phone: string;
  createdAt: string;
};

type PaymentInfo = {
  status: string;
};

type ClientInfo = {
  leadStatus: string | undefined;
  leadInfo: LeadInfo;
  paymentInfo?: PaymentInfo;
};

type ClientInfoCardProps = {
  clientInfo: ClientInfo | undefined;
};

const getStatusLabel = (status: string | undefined): string => {
  switch (status) {
    case LeadStatus.INITIATED:
      return "Eligibility Form Under Review";
    case LeadStatus.CONSULTATIONLINKSENT:
    case LeadStatus.CONSULTATIONSCHEDULED:
      return "Consultation Pending";
    case LeadStatus.CONSULTATIONDONE:
    case LeadStatus.PAYMENTLINKSENT:
      return "Payment Pending";
    case LeadStatus.PAYMENTDONE:
      return "Payment Completed";
    case LeadStatus.REJECTED:
      return "Rejected";
    default:
      return "";
  }
};

const ClientInfoCard: React.FC<ClientInfoCardProps> = ({ clientInfo }) => {
  return (
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
            {getStatusLabel(clientInfo?.leadStatus)}
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
              Applied for:{" "}
              <strong>{clientInfo?.leadInfo?.appliedFor}</strong>
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
  );
};

export default ClientInfoCard;
