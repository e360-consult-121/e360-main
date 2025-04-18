import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import Invoice_Image from "../../../assets/Admin/Invoice_Image.jpeg";
import { PaymentInfoTypes } from "../../../features/admin/clientInformation/clientInformationTypes";
import { useSendPaymentLinkMutation } from "../../../features/admin/clientInformation/clientInformationApi";
import { useParams } from "react-router-dom";

const PaymentAndInvoiceManagement = ({
  paymentInfo,
  onRefreshLead,
} : {
  paymentInfo: PaymentInfoTypes;
  onRefreshLead: () => void;
}) => {
  const { leadid } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState("inr");
  const [loading, setLoading] = useState(false);

  const [sendPaymentLink] = useSendPaymentLinkMutation();

  const handleSendPaymentLink = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || !currency) {
      alert("Please enter a valid amount and select a currency.");
      return;
    }

    setLoading(true);
    try {
      const body = {
        currency,
        amount: Number(amount),
      };

      const data = await sendPaymentLink({ leadid, body }).unwrap();
      if (data.success === true) {
        alert("Payment link sent");
        onRefreshLead();
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while sending the payment link.");
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  return (
    <div>
      <Typography>
        {paymentInfo?.method
          ? `Payment Method : ${paymentInfo?.method}`
          : `Send Payment Link :`}
      </Typography>

      {paymentInfo?.status !== "PAID" && (
        <Button
        onClick={() => setDialogOpen(true)}
          disabled={loading}
          sx={{
            p: 1.2,
        bgcolor: "#F6C328",
        color: "black",
        borderRadius: "15px",
        mt: 2,
        textTransform:"none",
            "&:disabled": {
              bgcolor: "#e0e0e0",
              color: "gray",
            },
          }}
        >
          {loading ? "Sending..." : " Send Payment Link"}
        </Button>
      )}

      {paymentInfo?.status === "PAID" ? (
        <Box>
          <img src={Invoice_Image} className="w-[168px] h-[93px] my-3" />
          <Typography sx={{ mt: 2 }}>
            Invoice:{" "}
            <a
              href={paymentInfo?.invoice}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#F8CC51",
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              View Invoice
            </a>
          </Typography>
        </Box>
      ) : (
        <>
          {/* {paymentInfo?.status === "LINKSENT" && (
      <Typography sx={{ mt: 2, color: "green", fontWeight: "bold" }}>
        Payment link has been sent to the client.
      </Typography>
    )} */}

          {/* Modal to select currency and amount */}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle align="center" fontWeight="bold">
              Enter Payment Details
            </DialogTitle>
            <DialogContent>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={currency}
                  label="Currency"
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <MenuItem value="inr">₹</MenuItem>
                  <MenuItem value="usd">$</MenuItem>
                  <MenuItem value="eur">€</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                type="number"
                sx={{ mt: 2 }}
              />
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
              <Button
                onClick={handleSendPaymentLink}
                variant="contained"
                sx={{
                  bgcolor: "#F6C328",
                  color: "black",
                  borderRadius: 10,
                  textTransform: "none",
                  px: 4,
                }}
              >
                Send
              </Button>
              <Button
                onClick={() => setDialogOpen(false)}
                variant="outlined"
                sx={{
                  color: "black",
                  borderColor: "black",
                  borderRadius: 10,
                  textTransform: "none",
                  px: 4,
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default PaymentAndInvoiceManagement;
