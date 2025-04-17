import { Box, Typography, Button, Card, Chip } from "@mui/material";
import { formatDate, formatTime } from "../../../utils/FormateDate";
import { ConsultationInfoTypes } from "../../../features/admin/clientInformation/clientInformationTypes";
// import { useParams } from "react-router-dom";
// import { useMarkConsultationAsCompletedMutation } from "../../../features/admin/consultations/consultationApi";

const Consultations = ({ consultationInfo }: { consultationInfo: ConsultationInfoTypes }) => {

  // const {leadid} = useParams();
  // const [markConsultationAsCompleted] = useMarkConsultationAsCompletedMutation();

  const handleMarkComplete = async()=>{
      // try {
      //   await markConsultationAsCompleted(consultationId).unwrap();
      //   alert("done")
      // } catch (error) {
      //   console.log(error)
      // }
  }

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "#FAF9F8",
        boxShadow: "none",
        maxWidth: 300,
      }}
    >
      {/* Title & Status */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontWeight="bold" fontSize={18}>
          Consultation
        </Typography>
        <Chip
          label={consultationInfo?.status}
          sx={{
            bgcolor: consultationInfo?.status === "Completed" ? "#CAE6CB" : "#FFF9E6",
            color: "#3D3D3D",
            fontWeight: "thin",
            fontSize: 13,
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Date & Time */}
      <Box mt={2}>
        <Typography fontWeight="bold">Date</Typography>
        <Typography>{formatDate(consultationInfo?.meetTime || "")}</Typography>
        <Typography fontWeight="bold" mt={1}>
          Time
        </Typography>
        <Typography>{formatTime(consultationInfo?.meetTime || "")}</Typography>
      </Box>

      {/* Buttons */}
      {consultationInfo?.status === "SCHEDULED" && (
        <a href={consultationInfo?.joinUrl} target="_blank">
          <Button
            fullWidth
            sx={{
              bgcolor: "#F6C328",
              color: "black",
              borderRadius: "15px",
              mt: 3,
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#E5B120" },
            }}
          >
            Join Consultation
          </Button>
        </a>
      )}

      {status === "Complete" && (
        <Button
          fullWidth
          onClick={handleMarkComplete}
          sx={{
            bgcolor: "#E0E0E0",
            color: "black",
            borderRadius: "15px",
            mt: 2,
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#D5D5D5" },
          }}
        >
          Mark Complete
        </Button>
      )}
    </Card>
  );
};

export default Consultations;
