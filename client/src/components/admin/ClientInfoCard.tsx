import { Card, CardContent, Typography, Box, Tooltip } from "@mui/material";

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
        mx: { md: 5 },
        pl: { md: 3 },
        pr: { md: 5 },
        ml:{xs:"-15px",md:0},
        boxShadow: "none",
        bgcolor: "#F6F5F5",
        borderRadius: "15px",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 1,
            mb: 2,
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
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            gap: { xs: 1, md: 2 },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                mb: { xs: 1, md: 0 },
              }}
            >
              Name: {clientInfo?.leadInfo?.name}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                mb: { xs: 1, md: 0 },
              }}
            >
              Applied for: <strong>{clientInfo?.leadInfo?.appliedFor}</strong>
            </Typography>
            <Tooltip title={clientInfo?.leadInfo?.email || ""} arrow>
              <Typography
                sx={{
                  fontSize: { xs: "14px", md: "16px" },
                  maxWidth: { xs: "350px", md: "500px" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                Email: {clientInfo?.leadInfo?.email}
              </Typography>
            </Tooltip>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                mb: { xs: 1, md: 0 },
              }}
            >
              Case ID: {clientInfo?.leadInfo?.caseId}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                mb: { xs: 1, md: 0 },
              }}
            >
              Number: {clientInfo?.leadInfo?.phone}
            </Typography>
            {clientInfo?.paymentInfo?.status === "PAID" && (
              <Typography
                sx={{
                  fontSize: { xs: "14px", md: "16px" },
                  mb: { xs: 1, md: 0 },
                }}
              >
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
