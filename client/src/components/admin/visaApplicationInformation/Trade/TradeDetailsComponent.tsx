import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";

const TradeDetailsComponent = () => {
  const [tradeName, setTradeName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [otherTradeName, setOtherTradeName] = useState("");

  const handleSubmit = () => {
    console.log("Submitted Trade Name:", tradeName);
    // api call to send trade name change
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleApprove = () => {
    console.log("Other Trade Name:", otherTradeName);
    handleCloseModal();
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* Red alert message */}
      <Box display="flex" alignItems="center" gap={1} color="red" mb={3}>
        <Typography sx={{ fontWeight: "bold" }}>❗</Typography>
        <Typography
          sx={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={handleOpenModal}
        >
          Client requested for a Trade Name Change. Click here to View.
        </Typography>
      </Box>

      {/* Existing Trade Name Preferences */}
      <Typography sx={{ my: 1 }}>Trade Name Preference : tradeName1</Typography>
      <Typography sx={{ my: 1 }}>Trade Name Preference : tradeName2</Typography>
      <Typography sx={{ my: 1 }}>Trade Name Preference : tradeName3</Typography>

      {/* Input + Submit */}
      <Box mt={2} display="flex" gap={2} alignItems="center">
        <TextField
          label="Trade Name"
          required
          placeholder="Enter Trade Name"
          value={tradeName}
          onChange={(e) => setTradeName(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <Button
          variant="outlined"
          onClick={handleSubmit}
          sx={{
            borderColor: "black",
            color: "black",
            textTransform: "none",
            borderRadius: "20px",
            py: 1,
            px: 3,
          }}
        >
          Submit
        </Button>
      </Box>

      {/* Modal Dialog */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Trade Name Change Request
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Client has requested for a Trade Name Change.
          </Typography>

          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            Reason for Change
          </Typography>
          <Typography sx={{ mb: 2, color: "text.secondary" }}>
           Reason for change
          </Typography>

          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            Select one of the Trade Names to Approve:
          </Typography>

          <Typography sx={{ my: 1 }}>Trade Name Preference : tradeName1</Typography>
          <Typography sx={{ my: 1 }}>Trade Name Preference : tradeName2</Typography>
          <Typography sx={{ my: 1 }}>Trade Name Preference : tradeName3</Typography>

          <TextField
            label="Suggest Trade Name"
            placeholder="Enter new Trade Name"
            value={otherTradeName}
            onChange={(e) => setOtherTradeName(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleApprove}
            variant="contained"
            sx={{
              backgroundColor: "#FFC107",
              color: "black",
              textTransform: "none",
              borderRadius: "20px",
              "&:hover": { backgroundColor: "#FFB300" },
            }}
          >
            Send for Approval
          </Button>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: "20px",
            }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TradeDetailsComponent;
