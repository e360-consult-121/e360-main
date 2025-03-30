import { Button, Typography } from "@mui/material"

const PaymentAndInvoiceManagement = () => {
  return (
    <div>
        <Typography>Payment Method</Typography>
        <Button
        sx={{
          p:1,
          bgcolor: "#F6C328",
          color: "black",
          borderRadius: "15px",
          mt: 3,
          textTransform: "none",
          "&:hover": { bgcolor: "#E5B120" },
        }}
      >
        Send Payment Remainder
      </Button>    </div>
  )
}

export default PaymentAndInvoiceManagement