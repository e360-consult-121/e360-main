import { Box, Typography, Button } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";

import { RequirementTypes } from "../visaAppicationInformationTypes";

function areAllRequiredDocsVerified(requirements: any) {
  return requirements
    .filter((req: any) => req.required)
    .every(
      (req: any) => req.reqStatus === "UPLOADED" || req.reqStatus === "VERIFIED"
    );
}

const StepItem = ({
  step,
  index,
  isActive,
  showRequirements,
  onApprove,
  onReject,
  stepStatus,
  currentStepIndex,
  requirements,
}: {
  step: any;
  index: number;
  isActive: boolean;
  showRequirements: any;
  stepStatus: string;
  onApprove: () => void;
  onReject: () => void;
  currentStepIndex: number;
  requirements: RequirementTypes[];
}) => {
  const isCompleted = index < currentStepIndex;

  return (
    <Box display="flex" flexDirection="column" mb={5}>
      <Box display="flex" alignItems="center" mb={0}>
        {isCompleted ? (
          <div className="w-8 h-8 bg-golden-yellow-100 text-neutrals-950 rounded-full flex items-center justify-center">
            <Icon icon="icon-park-outline:done-all" width="24" height="24" />
          </div>
        ) : isActive ? (
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
          <Box ml="auto" display="flex" alignItems="center">
            {stepStatus === "APPROVED" ? (
              <>
                <div className="bg-[#E5F5EC] text-[#1E8E3E] px-6 py-2 rounded-full font-medium mr-3">
                  Approved
                </div>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    textTransform: "none",
                    borderColor: "#F54337",
                    color: "#F54337",
                    borderRadius: "19px",
                  }}
                  onClick={onReject}
                >
                  Reject
                </Button>
              </>
            ) : stepStatus === "REJECTED" ? (
              <>
                <button
                  onClick={onApprove}
                  className={`px-10 py-2 rounded-4xl mr-3 ${
                    areAllRequiredDocsVerified(requirements)
                      ? "bg-[#F6C328] text-black cursor-pointer"
                      : "bg-[#E4E3E3] text-[#7F7E7D] cursor-not-allowed"
                  }`}
                  disabled={!areAllRequiredDocsVerified(requirements)}
                >
                  Approve
                </button>
                <div className="bg-[#FEEAED] text-[#F54337] px-6 py-2 rounded-full font-medium">
                  Rejected
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={onApprove}
                  className={`px-10 py-2 rounded-4xl mr-3 ${
                    areAllRequiredDocsVerified(requirements)
                      ? "bg-[#F6C328] text-black cursor-pointer"
                      : "bg-[#E4E3E3] text-[#7F7E7D] cursor-not-allowed"
                  }`}
                  disabled={!areAllRequiredDocsVerified(requirements)}
                >
                  Approve
                </button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    textTransform: "none",
                    borderColor: "#F54337",
                    color: "#F54337",
                    borderRadius: "19px",
                  }}
                  onClick={onReject}
                >
                  Reject
                </Button>
              </>
            )}
          </Box>
        )}
      </Box>
      {isActive && <Box mt={2}>{showRequirements}</Box>}
    </Box>
  );
};

export default StepItem;
