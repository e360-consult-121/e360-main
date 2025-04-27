import { Box, Button, Typography, Paper } from "@mui/material";

const BankDetails = ({ requirementData,onContinue }: { requirementData: any,onContinue:()=>void }) => {
  return (
    <Box
      mt={12}
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
          width: "100%",
          maxWidth: 500,
          backgroundColor: "#f9f7f7",
          boxShadow: "none",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Bank Account Details
        </Typography>

        {requirementData.map((item:any, index:number) => (
          <Box key={index} mb={1} display="flex" justifyContent="space-between">
            <Typography fontWeight="bold">{item.question}</Typography>
            <Typography>{item.value}</Typography>
          </Box>
        ))}
      </Paper>

      {/* <Typography mt={4} maxWidth={600}>
        For security purposes, please{" "}
        <Link
          href="#"
          underline="always"
          fontStyle="italic"
          sx={{
            color: "black",
          }}
        >
          log in
        </Link>{" "}
        for the first time and update your password immediately.
      </Typography> */}

      <Box mt={3} display="flex" gap={2}>
        {/* <Button
          variant="outlined"
          sx={{
            color: "black",
            borderColor: "black",
            textTransform: "none",
          }}
        >
          Download Details
        </Button> */}
        <Button
          onClick={onContinue}
          variant="outlined"
          sx={{
            color: "black",
            borderColor: "black",
            textTransform: "none",
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default BankDetails;
