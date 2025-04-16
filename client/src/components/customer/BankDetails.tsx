import {
  Box,
  Button,
  Typography,
  Paper,
  Link,
} from '@mui/material';

const BankDetails = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={2}
      textAlign="center"
    >
      <Typography variant="h6" mb={4}>
        Bank Account Opened.
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
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Bank Account Details
        </Typography>

        <Box mb={1} display="flex" justifyContent="space-between">
          <Typography fontWeight="bold">Name</Typography>
          <Typography>Johnny Brave</Typography>
        </Box>

        <Box mb={1} display="flex" justifyContent="space-between">
          <Typography fontWeight="bold">Account No.</Typography>
          <Typography>1234567890</Typography>
        </Box>

        {[...Array(3)].map((_, i) => (
          <Box key={i} mb={1} display="flex" justifyContent="space-between">
            <Typography fontWeight="bold">Bank Details</Typography>
            <Typography>Bank Details</Typography>
          </Box>
        ))}
      </Paper>

      <Typography mt={4} maxWidth={600}>
        For security purposes, please{' '}
        <Link href="#" underline="always" fontStyle="italic"
        sx={{
            color:"black"
        }}
        >
          log in
        </Link>{' '}
        for the first time and update your password immediately.
      </Typography>

      <Box mt={3} display="flex" gap={2}>
        <Button variant="outlined"
        sx={{
            color:"black",
            borderColor:"black",
            textTransform:"none"
        }}
        >Download Details</Button>
        <Button variant="outlined"
        sx={{
            color:"black",
            borderColor:"black",
            textTransform:"none"
        }}
        >Continue</Button>
      </Box>
    </Box>
  );
};

export default BankDetails;
