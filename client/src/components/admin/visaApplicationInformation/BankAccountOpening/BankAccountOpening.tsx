import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useSubmitRequirementsMutation } from "../../../../features/common/commonApi";

const BankAccountOpening = ({ requirements }: { requirements: any[] }) => {
  const [submitRequirements, { isLoading }] = useSubmitRequirementsMutation();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialData: Record<string, string> = {};

    requirements.forEach((req) => {
      initialData[req.reqStatusId] = req.value || "";
    });

    setFormData(initialData);
  }, [requirements]);

  const handleChange = (
    reqStatusId: string,
    value: string,
    requirementType: string
  ) => {
    if (requirementType === "NUMBER") {
      const numericValue = value.replace(/[^0-9.-]/g, "");

      setFormData((prev) => ({ ...prev, [reqStatusId]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [reqStatusId]: value }));
    }

    if (errors[reqStatusId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[reqStatusId];
        return newErrors;
      });
    }
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLDivElement>,
    requirementType: string
  ) => {
    if (requirementType === "NUMBER") {
      const isValidKey =
        /^[0-9.-]$/.test(event.key) ||
        ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
          event.key
        );

      if (!isValidKey) {
        event.preventDefault();
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    requirements.forEach((req) => {
      if (req.required) {
        const value = formData[req.reqStatusId] || "";

        if (!value.trim()) {
          newErrors[req.reqStatusId] = "This field is required";
          isValid = false;
        } else if (req.requirementType === "NUMBER" && isNaN(Number(value))) {
          newErrors[req.reqStatusId] = "Please enter a valid number";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const requirementsToSubmit = requirements.map((req) => ({
        reqStatusId: req.reqStatusId,
        value: formData[req.reqStatusId] || "",
      }));

      await submitRequirements(requirementsToSubmit).unwrap();

      console.log("All requirements submitted successfully");
    } catch (error) {
      console.error("Failed to submit requirements:", error);
    }
  };

  const chunkedRequirements = [];
  for (let i = 0; i < requirements.length; i += 2) {
    chunkedRequirements.push(requirements.slice(i, i + 2));
  }

  return (
    <Box p={4}>
      <Typography gutterBottom sx={{ fontSize: "16px", mb: 3 }}>
        Add Bank Account Details
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        {chunkedRequirements.map((chunk, rowIndex) => (
          <Box display="flex" gap={2} key={`row-${rowIndex}`}>
            {chunk.map((req) => (
              <Box flex={1} minWidth="250px" key={req.reqStatusId}>
                <TextField
                  label={req.question}
                  fullWidth
                  value={formData[req.reqStatusId] || ""}
                  onChange={(e) =>
                    handleChange(
                      req.reqStatusId,
                      e.target.value,
                      req.requirementType
                    )
                  }
                  onKeyDown={(e) => handleKeyPress(e, req.requirementType)}
                  inputProps={{
                    inputMode:
                      req.requirementType === "NUMBER" ? "numeric" : "text",
                  }}
                  type={req.requirementType === "NUMBER" ? "text" : "text"}
                  required={req.required}
                  error={!!errors[req.reqStatusId]}
                  helperText={
                    errors[req.reqStatusId] || (req.required ? "" : "Optional")
                  }
                />
              </Box>
            ))}
            {/* Add empty box if we have an odd number of fields in the last row */}
            {chunk.length === 1 && <Box flex={1} minWidth="250px" />}
          </Box>
        ))}
      </Box>

      <Box>
        <Button
          variant="outlined"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            borderColor: "black",
            color: "black",
            textTransform: "none",
            borderRadius: "20px",
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} color="inherit" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default BankAccountOpening;
