import React, { useState } from 'react';
import {
  TextField,
  Typography,
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { toast } from 'react-toastify';

const MedicalAppointment: React.FC = () => {
  const [status, setStatus] = useState('');
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [time, setTime] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = () => {
    if (!status || !date || !time || !hospitalName || !address || !contactNumber) {
      toast.info('Please fill all the fields!');
      return;
    }

    console.log({
      status,
      date: date.format('YYYY-MM-DD'),
      time,
      hospitalName,
      address,
      contactNumber,
    });
  };

  const handleApproveReschedule = () => {
    // You can replace this with your API call or other logic
    const rescheduleData = {
      date,
      time,
      hospitalName,
      address,
      contactNumber
    };

    console.log("Reschedule approved with data:", rescheduleData);
    // Close the modal
    handleCloseModal();
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box mt={2} p={2}>
        <Box display="flex" alignItems="center" gap={1} color="red" mb={3}>
          <Typography sx={{ fontWeight: 'bold' }}>❗</Typography>
          <Typography
            sx={{ cursor: 'pointer', }}
            onClick={handleOpenModal}
          >
            Client requested for a Reschedule of Medical test.<span className=' underline'>Click here to View.</span>
          </Typography>
        </Box>

        <Box display={'flex'} alignItems={'center'} gap={3}>
          <FormControl sx={{ mb: 2, minWidth: '400px' }}>
            <InputLabel>Status*</InputLabel>
            <Select
              value={status}
              label="Status*"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            sx={{
              borderColor: 'black',
              color: 'black',
              textTransform: 'none',
              borderRadius: '20px',
            }}
            onClick={() => console.log(`Status: ${status}`)}
          >
            Update status
          </Button>
        </Box>

        <Typography sx={{ fontSize: '16px', my: 3 }} gutterBottom>
          Add Medical Test Appointment Details
        </Typography>

        <Box display="flex" gap={2} mb={2}>
          <DatePicker
            label="Date*"
            value={date}
            onChange={(newDate) => setDate(newDate)}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
          <TextField
            label="Time*"
            placeholder="Enter Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            fullWidth
          />
        </Box>

        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Hospital Name*"
            placeholder="Enter Hospital name"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Address*"
            placeholder="Enter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
        </Box>

        <TextField
          label="Contact Number*"
          placeholder="Enter Contact details"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          sx={{ mb: 3, minWidth: '515px' }}
        />
      </Box>

      <Button
        variant="outlined"
        sx={{
          borderColor: 'black',
          color: 'black',
          textTransform: 'none',
          borderRadius: '20px',
        }}
        onClick={handleSubmit}
      >
        Submit
      </Button>

      {/* Modal for Reschedule Request */}
      <Dialog open={openModal} onClose={handleCloseModal}>
      <DialogTitle>Reschedule Request</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The client has requested a reschedule of their medical test. Please
          review the details and take appropriate action.
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            // renderInput={(params:any) => (
            //   <TextField {...params} fullWidth sx={{ mb: 2 }} required />
            // )}
          />
        </LocalizationProvider>

        <TextField
          label="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          required
        />

        <TextField
          label="Hospital Name"
          value={hospitalName}
          onChange={(e) => setHospitalName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          required
        />

        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          required
        />

        <TextField
          label="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleApproveReschedule} variant="contained" color="warning">
          Approve Reschedule
        </Button>
        <Button onClick={handleCloseModal} variant="outlined">
          Reject
        </Button>
      </DialogActions>
    </Dialog>
    </LocalizationProvider>
  );
};

export default MedicalAppointment;
