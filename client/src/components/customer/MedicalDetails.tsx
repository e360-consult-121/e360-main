import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from '@mui/material';
import { useState } from 'react';

const MedicalDetails = () => {

  const [rescheduleOpen,setRescheduleOpen] = useState(false)
  const [remarks, setRemarks] = useState("");
  
  const handleRescheduleOpen = ()=>{
    setRescheduleOpen(true)
  }


  const handleRescheduleClose = ()=>{
    setRemarks("")
    setRescheduleOpen(false)
  }


  return (
    <>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={2}
      textAlign="center"
    >
      <Typography  my={3} mx={25}>
      We are now processing your UAE residence visa. You will soon receive details for your medical test and  Emirates ID registration.
      </Typography>

      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 4,
          width: '100%',
          maxWidth: 500,
          backgroundColor: '#f9f7f7',
          boxShadow:"none"
        }}
      >
        <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
        Medical Test Appointment
        </Typography>
        <Chip
          label={"Schedule"}
          sx={{
            bgcolor: "#FFFDEA",
            color: "#3D3D3D",
            fontWeight: "thin",
            fontSize: 13,
            borderRadius: 2,
          }}
        />
        </Box>
        

        <Box mb={1} display="flex" justifyContent="space-between">
          <Typography fontWeight="bold">Date</Typography>
          <Typography>12 March</Typography>
        </Box>

        <Box mb={1} display="flex" justifyContent="space-between">
          <Typography fontWeight="bold">Time</Typography>
          <Typography>11:00 AM</Typography>
        </Box>

          <Box mb={1} display="flex" justifyContent="space-between">
            <Typography fontWeight="bold">Hospital Name</Typography>
            <Typography>Dubai Medical & Wellness Center</Typography>
          </Box>
          <Box mb={1} display="flex" justifyContent="space-between">
            <Typography fontWeight="bold">Address</Typography>
            <Typography>123 Al Wasl Road, Dubai, UAE</Typography>
          </Box>
          <Box mb={1} display="flex" justifyContent="space-between">
            <Typography fontWeight="bold">Contact</Typography>
            <Typography>123456789</Typography>
          </Box>
      </Paper>

      <Box mt={3} display="flex" gap={2}>
        <Button variant="outlined"
        onClick={handleRescheduleOpen}
        sx={{
            color:"black",
            borderColor:"black",
            textTransform:"none"
        }}
        >Request Reschedule</Button>
      </Box>
    </Box>
    <Dialog
            open={rescheduleOpen}
            onClose={handleRescheduleClose}
            PaperProps={{ sx: { borderRadius: 10, padding: 2 } }}
          >
            <DialogTitle align="center" sx={{ fontWeight: "bold", fontSize: "24px" }}>
            Request Medical Test Reschedule
            </DialogTitle>
    
            <DialogContent>
              <DialogContentText align="center">
              If you are unable to attend your scheduled medical test, you can request a reschedule. Our team will review your request and provide a new appointment date.
              </DialogContentText>
    
              <TextField
                label="Reason for Reschedule*"
                multiline
                minRows={3}
                maxRows={8}
                fullWidth
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                sx={{ mt: 3 }}
                placeholder="Provide a reason for Reschedule..."
                variant="outlined"
              />
            </DialogContent>
    
            <DialogActions>
              <Box display="flex" justifyContent="center" width="100%" gap={2}>
                <Button
                  variant="contained"
                  // onClick={handleRejectSubmit}
                  sx={{
                    py: 1,
                    px: 4,
                    minWidth: 270,
                    bgcolor: "#F6C328",
                    textTransform: "none",
                    borderRadius: "15px",
                    color:"black"
                  }}
                >
                  Submit Request               
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRescheduleClose}
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
    </>

  );
};

export default MedicalDetails;
