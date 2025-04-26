import { useState } from 'react';
import { Button, MenuItem, Select, FormControl, InputLabel, TextField } from '@mui/material';

const AIMAStatusComponent = () => {
  const [status, setStatus] = useState('Application Drafting in Progress');
  const [aimaNumber, setAimaNumber] = useState('');

  const handleChange = (event: any) => {
    setStatus(event.target.value);
  };

  const handleUpdate = () => {
    console.log('Selected Status:', status);
    if (status === 'AIMA Appointment Scheduled') {
      console.log('AIMA Number:', aimaNumber);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <FormControl variant="outlined" size="small">
        <InputLabel>Status*</InputLabel>
        <Select
          value={status}
          onChange={handleChange}
          label="Status*"
          style={{ minWidth: 250 }}
        >
          <MenuItem value="Application Drafting in Progress">Application Drafting in Progress</MenuItem>
          <MenuItem value="Application Approved">Application Approved</MenuItem>
          <MenuItem value="Appointment Confirmed">Appointment Confirmed</MenuItem>
          <MenuItem value="Visa Approved">Visa Approved</MenuItem>
          <MenuItem value="AIMA Appointment Scheduled">AIMA Appointment Scheduled</MenuItem>
        </Select>
      </FormControl>

      {status === 'AIMA Appointment Scheduled' && (
        <TextField
          label="AIMA Number*"
          variant="outlined"
          size="small"
          value={aimaNumber}
          onChange={(e) => setAimaNumber(e.target.value)}
          style={{ minWidth: 200 }}
        />
      )}

      <Button
        variant="outlined"
        onClick={handleUpdate}
        style={{
          color: 'black',
          borderColor: 'black',
          textTransform: 'none',
          borderRadius: '20px',
        }}
      >
        Update status
      </Button>
    </div>
  );
};

export default AIMAStatusComponent;
