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
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

const MedicalAppointment: React.FC = () => {
  const [status, setStatus] = useState('');
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [time, setTime] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleSubmit = () => {
    if (!status || !date || !time || !hospitalName || !address || !contactNumber) {
      alert('Please fill all the fields!');
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box mt={2} p={2}>
        <Box display={'flex'} alignItems={'center'} gap={3}>
        <FormControl  sx={{ mb: 2,minWidth:"400px" }}>
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

        <Button variant="outlined" sx={{
          borderColor:"black",
          color:"black",
          textTransform:"none",
          borderRadius:"20px"
        }} 
        onClick={() => console.log(`Status: ${status}`)}>
          Update status
        </Button>
        </Box>

        <Typography sx={{fontSize:"16px",my:3}} gutterBottom>
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
          sx={{ mb: 3 ,minWidth:"515px"}}
        />
      </Box>
      <Button variant="outlined" sx={{
          borderColor:"black",
          color:"black",
          textTransform:"none",
          borderRadius:"20px"
        }} 
        onClick={handleSubmit}>
          Submit
      </Button>
    </LocalizationProvider>
  );
};

export default MedicalAppointment;
