import  { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

const TradDetails = () => {
  const [tradeName, setTradeName] = useState('');
  const [altName1, setAltName1] = useState('');
  const [altName2, setAltName2] = useState('');

  const handleSubmit = () => {
    console.log({
      tradeName,
      altName1,
      altName2,
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={2}
    >
      <Typography variant="h5" fontWeight="bold" mb={4}>
        Enter your Trade Name
      </Typography>

      <Box width="100%" maxWidth={500}>
        <Typography mb={1}>Trade Name*</Typography>
        <TextField
          fullWidth
          placeholder="Enter Trade Name"
          variant="outlined"
          value={tradeName}
          onChange={(e) => setTradeName(e.target.value)}
          sx={{
            mb: 3,
            backgroundColor: '#F7F5F4',
            borderRadius: 1, 
            borderColor:"#0F1EF"
          }}
        />

        <Typography mb={1}>Alternate Trade Name 1*</Typography>
        <TextField
          fullWidth
          placeholder="Enter New Trade Name"
          variant="outlined"
          value={altName1}
          onChange={(e) => setAltName1(e.target.value)}
          sx={{
            mb: 3,
            backgroundColor: '#F7F5F4',
            borderRadius: 1,
            borderColor:"#0F1EF"
          }}
        />

        <Typography mb={1}>Alternate Trade Name 2*</Typography>
        <TextField
          fullWidth
          placeholder="Enter New Trade Name"
          variant="outlined"
          value={altName2}
          onChange={(e) => setAltName2(e.target.value)}
          sx={{
            mb: 4,
            backgroundColor: '#F7F5F4',
            borderRadius: 1,
            borderColor:"#0F1EF"
          }}
        />

        <Box display="flex" justifyContent="center">
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#F6C328',
              color: '#000',
              fontWeight: 'light',
              px: 4,
              py: 1,
              borderRadius: '16px',
              textTransform: 'none',
            }}
          >
            Send for Approval
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TradDetails