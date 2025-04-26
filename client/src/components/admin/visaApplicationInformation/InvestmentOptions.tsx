import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useAddRealStateOptionsMutation } from '../../../features/admin/visaApplicationInformation/visaApplicationInformationApi';

const InvestmentOptions = ({ stepStatusId, refetch }: { stepStatusId: string, refetch: () => void }) => {
  const [addRealStateOption, setAddRealStateOption] = useState('');
  const [addRealStateOptions, { isLoading }] = useAddRealStateOptionsMutation();

  const handleSend = async () => {
    if (!addRealStateOption.trim()) {
      alert('Please enter a remark before sending.');
      return;
    }

    try {
      await addRealStateOptions({
        stepStatusId,
        realStateOptions: addRealStateOption
      }).unwrap();

      setAddRealStateOption('');
      refetch(); // Call refetch if needed
      alert('Successfully submitted Real State Options');
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <Box display="flex" alignItems="flex-start" p={2} gap={5}>
      <Box>
        <Typography variant="body2">
          <strong>Investment Option</strong> : Real Estate Investment
        </Typography>
        <Typography variant="body2" mt={0.5}>
          Consultation : -
        </Typography>

        <TextField
          label="Remarks"
          placeholder="Enter Remarks"
          multiline
          rows={3}
          value={addRealStateOption}
          onChange={(e) => setAddRealStateOption(e.target.value)}
          variant="outlined"
          size="small"
          margin="normal"
          fullWidth
        />
      </Box>

      <Button
        variant="contained"
        disabled={isLoading}
        sx={{
          backgroundColor: isLoading ? 'grey.400' : '#FDCB2E',
          color: '#000',
          borderRadius: '16px',
          height: '40px',
          mt: 12,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: isLoading ? 'grey.400' : '#e6b800',
          },
        }}
        onClick={handleSend}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </Button>
    </Box>
  );
};

export default InvestmentOptions;
