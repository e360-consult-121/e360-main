import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const InvestmentOptions: React.FC = () => {
  const [additionalFields, setAdditionalFields] = useState<string[]>([""]);
  const [errors, setErrors] = useState<string[]>([""]);

  const handleChangeField = (index: number, value: string) => {
    const newFields = [...additionalFields];
    newFields[index] = value;
    setAdditionalFields(newFields);

    const newErrors = [...errors];
    newErrors[index] = value.trim() === "" && index === 0 ? "This field is required" : "";
    setErrors(newErrors);
  };

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, ""]);
    setErrors([...errors, ""]);
  };

  const handleRemoveField = (index: number) => {
    if (additionalFields.length > 1) {
      const newFields = additionalFields.filter((_, i) => i !== index);
      const newErrors = errors.filter((_, i) => i !== index);
      setAdditionalFields(newFields);
      setErrors(newErrors);
    }
  };

  const handleSend = () => {
    if (additionalFields[0].trim() === "") {
      const updatedErrors = [...errors];
      updatedErrors[0] = "This field is required";
      setErrors(updatedErrors);
      return;
    }

    console.log("Investment Option:", "Real Estate Investment");
    console.log("Consultation:", "-");

    additionalFields.forEach((value, index) => {
      console.log(`Additional Field ${index + 1}:`, value);
    });
  };

  return (
    <Box p={4} maxWidth={400}>
      <Typography variant="body1">
        <strong>Investment Option:</strong> Real Estate Investment
      </Typography>
      <Typography variant="body1">
        <strong>Consultation:</strong> -
      </Typography>

      <Stack spacing={2} mt={2}>
        {additionalFields.map((field, idx) => (
          <Box key={idx} display="flex" alignItems="center" gap={1}>
            <TextField
              fullWidth
              label="Remarks"
              value={field}
              onChange={(e) => handleChangeField(idx, e.target.value)}
              variant="outlined"
              error={!!errors[idx]}
              helperText={errors[idx]}
            />
            {additionalFields.length > 1 && (
              <IconButton
                aria-label="remove"
                color="error"
                onClick={() => handleRemoveField(idx)}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
        ))}

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            sx={{
              maxWidth: "100px",
              borderColor: "black",
              color: "black",
              textTransform: "none",
              borderRadius: "20px",
            }}
            onClick={handleAddField}
          >
            Add
          </Button>

          <Button
            variant="contained"
            sx={{
              maxWidth: "100px",
              textTransform: "none",
              borderRadius: "20px",
              backgroundColor: "#F7C02D",
              color: "black",
            }}
            onClick={handleSend}
          >
            Send
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default InvestmentOptions;
