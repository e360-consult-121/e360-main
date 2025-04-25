import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

const BankAccountOpening = () => {
  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    bankingDetails1: "",
    bankingDetails2: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const allFilled = Object.values(formData).every(
      (value) => value.trim() !== ""
    );

    if (!allFilled) {
      alert("Please fill out all fields before submitting.");
    } else {
      console.log("Form Submitted:", formData);
      // Optionally reset form:
      // setFormData({ name: '', accountNumber: '', bankingDetails1: '', bankingDetails2: '' });
    }
  };

  return (
    <Box p={4}>
      <Typography  gutterBottom sx={{fontSize:"16px",mb:3}}>
        Add Bank Account Details
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        <Box display="flex" gap={2}>
          <Box flex={1} minWidth="250px">
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              // variant="filled"
            />
          </Box>

          <Box flex={1} minWidth="250px">
            <TextField
              label="Account number"
              name="accountNumber"
              fullWidth
              value={formData.accountNumber}
              onChange={handleChange}
              // variant="filled"
            />
          </Box>
        </Box>

        <Box display="flex" gap={2}>
          <Box flex={1} minWidth="250px">
            <TextField
              label="Banking Details"
              name="bankingDetails1"
              fullWidth
              value={formData.bankingDetails1}
              onChange={handleChange}
              // variant="filled"
            />
          </Box>

          <Box flex={1} minWidth="250px">
            <TextField
              label="Banking Details"
              name="bankingDetails2"
              fullWidth
              value={formData.bankingDetails2}
              onChange={handleChange}
              // variant="filled"
            />
          </Box>
        </Box>
      </Box>

      <Box>
        <Button variant="outlined" onClick={handleSubmit} sx={{
          borderColor:"black",
          color:"black",
          textTransform:"none",
          borderRadius:"20px"
        }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default BankAccountOpening;
