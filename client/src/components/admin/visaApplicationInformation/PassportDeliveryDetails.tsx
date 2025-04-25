import React, { useState } from 'react';
import { TextField, Typography, Box, Button } from '@mui/material';

type ClientDetails = {
  name: string;
  email: string;
  phone: string;
  address: string;
  cityCountry: string;
  postalCode: string;
};

type PassportDeliveryDetailsProps = {
  clientDetails: ClientDetails;
};

const PassportDeliveryDetails: React.FC<PassportDeliveryDetailsProps> = ({ clientDetails }) => {
  const [courierService, setCourierService] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');

  const handleSubmit = () => {
    if (
      !courierService ||
      !trackingNumber ||
      !trackingUrl ||
      !supportEmail ||
      !supportPhone
    ) {
      alert('Please fill all the fields!');
      return;
    }

    console.log({
      courierService,
      trackingNumber,
      trackingUrl,
      supportEmail,
      supportPhone
    });
  };

  return (
    <Box p={2}>
      <Typography gutterBottom sx={{fontSize:"16px"}}>
        Client Delivery Details
      </Typography>

      <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={3}  sx={{fontSize:"14px"}}>
        <Box width={{ xs: '100%', md: '48%', }} mb={1}>
          <Typography><strong>Name:</strong> {clientDetails.name}</Typography>
          <Typography><strong>Delivery Address:</strong> {clientDetails.address}</Typography>
          <Typography><strong>City/Country:</strong> {clientDetails.cityCountry}</Typography>
        </Box>

        <Box width={{ xs: '100%', md: '48%' }} mb={1}>
          <Typography><strong>Email address:</strong> {clientDetails.email}</Typography>
          <Typography><strong>Phone Number:</strong> {clientDetails.phone}</Typography>
          <Typography><strong>Postal Code:</strong> {clientDetails.postalCode}</Typography>
        </Box>
      </Box>

      <Typography  gutterBottom  sx={{fontSize:"16px"}}>
        Add Passport Delivery Details
      </Typography>

      <Typography  gutterBottom  sx={{fontSize:"14px"}}>
        Shipping Provider & Tracking Info
      </Typography>

      <Box display="flex" gap={2} my={2}>
        <TextField
          label="Courier Service*"
          placeholder="Enter Courier Service"
          value={courierService}
          onChange={(e) => setCourierService(e.target.value)}
          // variant="filled"
          fullWidth
        />
        <TextField
          label="Tracking Number*"
          placeholder="Enter Tracking Number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          fullWidth
          // variant="filled"
        />
        <TextField
          label="Tracking URL*"
          placeholder="Enter Tracking URL"
          value={trackingUrl}
          onChange={(e) => setTrackingUrl(e.target.value)}
          fullWidth
          // variant="filled"
        />
      </Box>

      <Typography  sx={{fontSize:"14px"}} gutterBottom>
        Additional Support
      </Typography>

      <Box display="flex" gap={2} my={2}>
        <TextField
          label="Email*"
          placeholder="Enter Support Email"
          value={supportEmail}
          onChange={(e) => setSupportEmail(e.target.value)}
          fullWidth
          // variant="filled"

        />
        <TextField
          label="Phone Number*"
          placeholder="Enter Support Phone Number"
          value={supportPhone}
          onChange={(e) => setSupportPhone(e.target.value)}
          fullWidth
          // variant="filled"
          />
      </Box>

      <Button variant="outlined" onClick={handleSubmit} sx={{
          borderColor:"black",
          color:"black",
          textTransform:"none",
          borderRadius:"20px"
        }}>
        Submit
      </Button>
    </Box>
  );
};

export default PassportDeliveryDetails;
