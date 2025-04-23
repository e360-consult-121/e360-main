import { Box, Typography, Button } from "@mui/material";

const StepItem = ({
  step,
  index,
  isActive,
  showRequirements,
  onApprove,
  onReject,
}: {
  step: any;
  index: any;
  isActive: any;
  showRequirements: any;
  onApprove: any;
  onReject: any;
}) => {
  return (
    <Box display="flex" flexDirection="column" mb={5}>
      <Box display="flex" alignItems="center" mb={0}>
        {isActive ? (
          <div className="w-fit rounded-full border-[4px] border-golden-yellow-50">
            <div className="rounded-full border-[5px] border-[#FEFCEA]">
              <div className="w-8 h-8 bg-[#FAE081] rounded-full flex items-center justify-center text-black font-bold text-lg">
                {index + 1}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-fit rounded-full border-[4px] border-white">
          <div className="rounded-full border-[5px] border-[#F2F3F3]">
            <div className="w-8 h-8 bg-[#D8D7D4] rounded-full flex items-center justify-center text-black font-bold text-lg">
              {index + 1}
            </div>
          </div>
        </div>
        )}
        <Typography
          fontWeight={isActive ? "bold" : "medium"}
          color={isActive ? "text.primary" : "grey.500"}
          sx={{
            ml: 1,
            fontSize: "17px",
          }}
        >
          {step}
        </Typography>
        {isActive && (
          <Box ml="auto">
            <Button
              size="large"
              sx={{
                mr: 2.5,
                textTransform: "none",
                boxShadow: "none",
                borderRadius: "15px",
                bgcolor: "#F6C328",
                color: "black",
              }}
              onClick={onApprove}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                textTransform: "none",
                borderColor: "#F54337",
                color: "#F54337",
                borderRadius: "15px",
              }}
              onClick={onReject}
            >
              Reject
            </Button>
          </Box>
        )}
      </Box>
      {isActive && <Box mt={2}>{showRequirements}</Box>}
    </Box>
  );
};

export default StepItem;
