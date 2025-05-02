import { Box, Button, Typography, CircularProgress } from "@mui/material";
import ProcessComponent from "../ProcessComponent";
import { useFetchPaymentInfoQuery } from "../../../../features/admin/visaApplication/additional/dubaiApis";

const PaymentMain = ({
  stepStatusId,
  onContinue,
}: {
  stepStatusId: string;
  phase: string;
  onContinue: () => void;
}) => {
  const { data, isLoading: isPaymentInfoLoading } = useFetchPaymentInfoQuery({
    stepStatusId,
  });

  const handleProceedToPayment = () => {
    if (data?.data?.paymentLink) {
      window.open(data.data.paymentLink, "_blank");
    }
  };

  const handleViewInvoice = () => {
    if (data?.data?.invoiceUrl) {
      window.open(data.data.invoiceUrl, "_blank");
    }
  };

  if (isPaymentInfoLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data?.data) {
    return <ProcessComponent label="Processing... " date="" status="" />;
  }

  // Display based on payment status
  return (
    <Box p={3}>
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        <Typography variant="body1">
          Amount: {data.data.currency === "inr" ? "₹" : data.data.currency === "usd" ? "$" : "€"} {data.data.amount}
        </Typography>
        <Typography variant="body1" sx={{ color: getStatusColor(data.data.status) }}>
          Status: {formatStatus(data.data.status)}
        </Typography>
      </Box>

      {/* Action buttons based on status */}
      <Box display="flex" gap={2}>
        {data.data.status === "LINKSENT" && (
          <Button
            onClick={handleProceedToPayment}
            variant="contained"
            sx={{
              bgcolor: "#F6C328",
              color: "black",
              borderRadius: 10,
              textTransform: "none",
              px: 4,
            }}
          >
            Proceed to Payment
          </Button>
        )}

        {data.data.status === "PAYMENT_DONE" && data.data.invoiceUrl && (
          <Button
            onClick={handleViewInvoice}
            variant="contained"
            sx={{
              bgcolor: "#F6C328",
              color: "black",
              borderRadius: 10,
              textTransform: "none",
              px: 4,
            }}
          >
            View Invoice
          </Button>
        )}

        {data.data.status === "PAYMENT_DONE" && (
          <Button
            onClick={onContinue}
            variant="contained"
            sx={{
              bgcolor: "#4CAF50",
              color: "white",
              borderRadius: 10,
              textTransform: "none",
              px: 4,
            }}
          >
            Continue
          </Button>
        )}
      </Box>
    </Box>
  );
};

// Helper functions
const formatStatus = (status: string): string => {
  switch (status) {
    case "LINKSENT":
      return "Payment Generated";
    case "PAYMENT_DONE":
      return "Payment Completed";
    default:
      return status;
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "LINKSENT":
      return "#FF9800"; // Orange
    case "PAYMENT_DONE":
      return "#4CAF50"; // Green
    default:
      return "inherit";
  }
};

export default PaymentMain;