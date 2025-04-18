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
  leadStatus,
  formSubmisionDate,
  eligibilityForm,
  onRefreshLead
}: {
  leadStatus:string
  formSubmisionDate:string,
  eligibilityForm: EligibilityFormTypes,
  onRefreshLead: () => void
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
      const data = await sendConsultationLink(leadid).unwrap();
      if(data.message !== undefined){
        alert("done")
      }
      else{
        alert("Error somthing wentwrong try again")
      }
    } catch (error) {
      console.error("Failed to send consultation link", error);
    }
  };

  const handleRejectSubmit = async() => {
    try {
      if (leadid === undefined) return console.log("LeadId absent")
      const body = {
        reasonOfRejection:remarks
      }
      const data = await rejectParticularLead({leadid:leadid,body}).unwrap()
      if(data.message !== undefined){
        alert("Rejected")
        onRefreshLead();
      }
      else{
        alert("Error somthing wentwrong try again")
      }
    } catch (error) {
      console.error("Failed to send consultation link", error); 
    } 
    finally {
      handleRejectClose();
    }
  };

  const formatLabel = (label: string) =>
  label
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // const renderFields = (
  //   data: any,
  //   sectionTitle: string | null = null,
  //   isNested = false
  // ) => {
  //   if (isEmptyOrNullObject(data)) return null;
  
  //   const fields = Object.entries(data).filter(
  //     ([_, value]) =>
  //       value !== null &&
  //       value !== undefined &&
  //       (typeof value === "object"
  //         ? !isEmptyOrNullObject(value)
  //         : value !== "")
  //   );
  
  //   return (
  //     <Box sx={{ mb: 3 }} key={sectionTitle}>
  //       {/* Show title only if it's not "additionalInfo" */}
  //       {sectionTitle && sectionTitle !== "additionalInfo" && (
  //         <>
  //         <Typography
  //           fontWeight="bold"
  //           variant={isNested ? "subtitle1" : "h6"}
  //           sx={{ mb: 1 }}
  //         >
  //           {formatLabel(sectionTitle)}
  //         </Typography>
  //         </>
  //       )}
  
  //       {fields.map(([key, value]) => {
  //         if (typeof value === "object" && !Array.isArray(value)) {
  //           return renderFields(value, key, true);
  //         } else if (Array.isArray(value)) {
  //           return (
  //             <Typography key={key} mb={1}>
  //               <strong>{formatLabel(key)}:</strong> {value.join(", ")}
  //             </Typography>
  //           );
  //         } else {
  //           return (
  //             <Typography key={key} mb={1}>
  //               <strong>{formatLabel(key)}:</strong> {value?.toString()}
  //             </Typography>
  //           );
  //         }
  //       })}
  //     </Box>
  //   );
  // };

  const renderFields = (
    data: any,
    sectionTitle: string | null = null,
    isNested = false
  ) => {
    if (isEmptyOrNullObject(data)) return null;
  
    const fields = Object.entries(data).filter(
      ([_, value]) =>
        value !== null &&
        value !== undefined &&
        (typeof value === "object"
          ? !isEmptyOrNullObject(value)
          : value !== "")
    );
  
    return (
      <Box sx={{ mb: 3 }} key={sectionTitle}>
        {/* Section title (no left margin) */}
        {sectionTitle && sectionTitle !== "additionalInfo" && (
          <Typography
            fontWeight="bold"
            variant={isNested ? "subtitle1" : "h6"}
            sx={{ mb: 1 }}
          >
            {formatLabel(sectionTitle)}
          </Typography>
        )}
  
        {/* Children (indented only if nested and not under additionalInfo) */}
        <Box
          sx={{
            ml:
              isNested && sectionTitle !== "additionalInfo"
                ? 3
                : 0,
          }}
        >
          {fields.map(([key, value]) => {
            if (typeof value === "object" && !Array.isArray(value)) {
              return renderFields(value, key, true);
            } else if (Array.isArray(value)) {
              return (
                <Typography key={key} mb={1}>
                  <strong>{formatLabel(key)}:</strong> {value.join(", ")}
                </Typography>
              );
            } else {
              return (
                <Typography key={key} mb={1}>
                  <strong>{formatLabel(key)}:</strong> {value?.toString()}
                </Typography>
              );
            }
          })}
        </Box>
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
      {leadStatus !== "REJECTED" ? <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}>
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
      </Box>:<Typography>
        This lead is rejected 
        </Typography>}

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
