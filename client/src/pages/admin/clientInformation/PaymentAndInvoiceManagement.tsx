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
import Invoice_Image from "../../../assets/Admin/Invoice_Image.png";
import { PaymentInfoTypes } from "../../../features/admin/clientInformation/clientInformationTypes";
import { useSendPaymentLinkMutation } from "../../../features/admin/clientInformation/clientInformationApi";
import { useParams } from "react-router-dom";

const PaymentAndInvoiceManagement = ({ paymentInfo }: { paymentInfo: PaymentInfoTypes }) => {
  const {leadid} = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState("₹");

  const [sendPaymentLink] = useSendPaymentLinkMutation();

  const handleSendPaymentLink = async() => {

    try {

      if(amount === "0" && currency === undefined) {
        throw new Error("Need amount and currency")
      }
      const body = {
        currency:currency,
        amount:amount
      }
      const data = await sendPaymentLink({leadid:leadid,body}).unwrap()
      if(data.success === true){
        alert("Paymentlink sent");
      }
      else{
        alert("Somthing went wrong")
      }
    } catch (error) {
      console.log(error)
    }finally{
      setDialogOpen(false);
    }
  };

  return (
    <div>
      <Typography>Payment Method : {paymentInfo?.method}</Typography>

      {paymentInfo?.status === "PAID" ? (
        <Box>
          <img src={Invoice_Image} className="my-3" />
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
          <Button
            onClick={() => setDialogOpen(true)}
            sx={{
              p: 1.2,
              bgcolor: "#F6C328",
              color: "black",
              borderRadius: "15px",
              mt: 3,
              textTransform: "none",
              "&:hover": { bgcolor: "#E5B120" },
            }}
          >
            Send Payment Link
          </Button>

          {/* Modal to select currency and amount */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
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
