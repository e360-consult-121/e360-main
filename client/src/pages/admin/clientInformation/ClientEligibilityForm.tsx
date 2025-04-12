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
  TextField,
} from "@mui/material";
import { EligibilityFormTypes } from "../../../features/admin/clientInformation/clientInformationTypes";
import { useSendConsultationLinkMutation } from "../../../features/admin/consultations/consultationApi";
import { useParams } from "react-router-dom";
import { useRejectParticularLeadMutation } from "../../../features/admin/leadManagement/leadManagementApi";
import { formatDate } from "../../../utils/FormateDate";


const isEmptyOrNullObject = (obj: any): boolean => {
  if (typeof obj !== "object" || obj === null) return true;

  return Object.values(obj).every((val) => {
    if (val === null || val === undefined || val === "") return true;
    if (typeof val === "object") return isEmptyOrNullObject(val);
    return false;
  });
};

const ClientEligibilityForm = ({
  formSubmisionDate,
  eligibilityForm,
}: {
  formSubmisionDate:string,
  eligibilityForm: EligibilityFormTypes;
}) => {
  
  const {leadid} = useParams()
  const [rejectOpen, setRejectOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  

  const [sendConsultationLink] = useSendConsultationLinkMutation();
  const [rejectParticularLead] = useRejectParticularLeadMutation();

  const handleRejectOpen = () => setRejectOpen(true);
  const handleRejectClose = () => {
    setRemarks("")
    setRejectOpen(false);
  }

  const handleFormOpen = () => setFormOpen(true);
  const handleFormClose = () => setFormOpen(false);

  const handleSendConsultation = async() => {
    try {
      if (leadid === undefined) return console.log("LeadId absent")
      await sendConsultationLink(leadid).unwrap();
      alert("done") 
    } catch (error) {
      console.error("Failed to send consultation link", error);
    }
  };

  const handleRejectSubmit = async() => {
    try {
      if (leadid === undefined) return console.log("LeadId absent")
      await rejectParticularLead({leadid,remarks}).unwrap()
      alert("rejected")
    } catch (error) {
      console.error("Failed to send consultation link", error); 
    } 
    finally {
      handleRejectClose();
    }
  };

  const formatLabel = (text: string) =>
    text
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

  const renderFields = (data: any, sectionTitle: string | null = null) => {
    
    //check for null fields if yes then don't show that
    if (isEmptyOrNullObject(data)) return null;

    return (
      <Box sx={{ mb: 3 }} key={sectionTitle}>
        {sectionTitle && (
          <Typography fontWeight="bold" variant="h6" sx={{ mb: 2 }}>
            {formatLabel(sectionTitle)}
          </Typography>
        )}
        {Object.entries(data || {}).map(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            return renderFields(value, key);
          } else {
            return (
              <TextField
                key={key}
                label={formatLabel(key)}
                value={value ?? "—"}
                fullWidth
                disabled
                multiline={String(value).length > 50}
                sx={{ mb: 2 }}
              />
            );
          }
        })}
      </Box>
    );
  };

  return (
    <div>
      <Typography sx={{ my: 1 }}>
        Form Submission Date : {formatDate(formSubmisionDate)}
      </Typography>

      <Typography sx={{ my: 3 }}>
        Eligibility Form:{" "}
        <span
          style={{
            color: "#F8CC51",
            textDecoration: "underline",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={handleFormOpen}
        >
          View Form
        </span>
      </Typography>

      {/* Buttons */}
      <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          onClick={handleSendConsultation}
          variant="contained"
          sx={{
            color: "black",
            bgcolor: "#F6C328",
            textTransform: "none",
            borderRadius: "10px",
            boxShadow: "none",
          }}
        >
          Send Consultation Link
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
          onClick={handleRejectOpen}
        >
          Reject Application
        </Button>
      </Box>

      {/* ===== FORM MODAL ===== */}
      <Dialog
        open={formOpen}
        onClose={handleFormClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 10, padding: 2 } }}
      >
        <DialogTitle align="center" fontWeight="bold">
          Eligibility Form
        </DialogTitle>
        <DialogContent dividers>{renderFields(eligibilityForm)}</DialogContent>
        <DialogActions>
          <Button
            onClick={handleFormClose}
            sx={{
              mx: "auto",
              px: 6,
              py: 1.2,
              borderRadius: 10,
              border: "1px solid black",
              color: "black",
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== REJECT APPLICATION MODAL ===== */}
      <Dialog
        open={rejectOpen}
        onClose={handleRejectClose}
        PaperProps={{ sx: { borderRadius: 10, padding: 2 } }}
      >
        <DialogTitle align="center" sx={{ fontWeight: "bold", fontSize: "24px" }}>
          Reject Application
        </DialogTitle>

        <DialogContent>
          <DialogContentText align="center">
            Are you sure you want to reject this application? This action cannot be undone.
          </DialogContentText>

          <DialogContentText
            align="center"
            bgcolor={"#F6F5F5"}
            padding={1}
            borderRadius={5}
            sx={{ mt: 2 }}
          >
            Admins have to provide a reason for rejection, which will be sent to the client.
          </DialogContentText>

          <TextField
            label="Rejection Remarks"
            multiline
            minRows={3}
            maxRows={8}
            fullWidth
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            sx={{ mt: 3 }}
            placeholder="Enter reason for rejection..."
            variant="outlined"
          />
        </DialogContent>

        <DialogActions>
          <Box display="flex" justifyContent="center" width="100%" gap={2}>
            <Button
              variant="contained"
              onClick={handleRejectSubmit}
              sx={{
                py: 1,
                px: 4,
                minWidth: 270,
                bgcolor: "#F44237",
                textTransform: "none",
                borderRadius: "15px",
              }}
            >
              Reject Application
            </Button>
            <Button
              variant="outlined"
              onClick={handleRejectClose}
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
