import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { PopupButton, useCalendlyEventListener } from "react-calendly";

const ClientEligibilityForm = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useCalendlyEventListener({
    onEventScheduled: (e) => console.log(e.data.payload)
  });

  return (
    <div>
      <Typography sx={{ my: 2 }}>
        Form Submission Date : 12 March 2025
      </Typography>
      <Typography sx={{ my: 2 }}>Eligibility Form</Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            color: "black",
            bgcolor: "#F6C328",
            textTransform: "none",
            borderRadius: "10px",
            boxShadow: "none",
          }}
        >
        <PopupButton
        url="https://calendly.com/adityanidhonkar2004/30min"
        rootElement={document.getElementById("root") as HTMLElement}
        text="Send Consultation Link"
        />
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: "red",
            textTransform: "none",
            borderRadius: "10px",
            boxShadow: "none",
            borderColor: "red",
          }}
          onClick={handleOpen}
        >
          Reject Application
        </Button>
        
      </Box>

      {/* Calendly Popup */}
      {/* <PopupWidget
        url="https://calendly.com/adityanidhonkar2004/30min"
        rootElement={document.getElementById("root")}
        open={calendlyOpen}
        onModalClose={() => setCalendlyOpen(false)}
      /> */}

      {/* Reject Application Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 10,
            padding: 2,
          },
        }}
      >
        <DialogTitle
          align="center"
          sx={{ fontWeight: "bold", fontSize: "24px" }}
        >
          Reject Application
        </DialogTitle>
        <DialogContent>
          <DialogContentText align="center">
            Are you sure you want to reject this application? This action cannot
            be undone.
          </DialogContentText>
          <DialogContentText
            align="center"
            bgcolor={"#F6F5F5"}
            padding={5}
            borderRadius={5}
            sx={{ mt: 2 }}
          >
            Admins have to provide a reason for rejection, which will be sent to
            the client.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                py: 1,
                px: 4,
                minWidth: 270,
                bgcolor: "#F44237",
                textTransform: "none",
                borderRadius: "15px",
                whiteSpace: "nowrap",
              }}
            >
              Reject Application
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                py: 1,
                px: 15,
                color: "black",
                borderColor: "black",
                textTransform: "none",
                borderRadius: "15px",
              }}
            >
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClientEligibilityForm;
