import { Box, Typography, Button, Card, Chip } from "@mui/material";

const Consultations = () => {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "#FAF9F8",
        boxShadow: "none",
        maxWidth: 300,
      }}
    >
      {/* Title & Status */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontWeight="bold" fontSize={18}>
          Consultation
        </Typography>
        <Chip
          label="Scheduled"
          sx={{
            bgcolor: "#FFF9E6",
            color: "#3D3D3D",
            fontWeight: "bold",
            fontSize: 12,
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Date & Time */}
      <Box mt={2}>
        <Typography fontWeight="bold">Date</Typography>
        <Typography>12 Mar 2025</Typography>
        <Typography fontWeight="bold" mt={1}>
          Time
        </Typography>
        <Typography>11:00 A.M.</Typography>
      </Box>

      {/* Button */}
      <Button
        fullWidth
        sx={{
          bgcolor: "#F6C328",
          color: "black",
          borderRadius: "15px",
          mt: 3,
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": { bgcolor: "#E5B120" },
        }}
      >
        Join Consultation
      </Button>
    </Card>
  );
};

export default Consultations;
