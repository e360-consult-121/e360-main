// import { useParams } from "react-router-dom";
// import CustomStepper from "../../../components/CustomStepper";
// import StepPhase from "../../../components/customer/StepPhase";
// import Chatbot from "../../../components/customer/ Chatbot";

// // This is the application of different visa types
// export interface StepsType {
//   label: string;
// }

// export interface DocumentUpload {
//   visaApplicationReqStatusId:string,
//   question: string;
//   requirementType: string;
//   required: string;
//   isUpload: boolean;
//   reqStatus?: "NOT_UPLOADED" | "UPLOADED" | "VERIFIED" | "RE_UPLOAD";
//   remarks?: string;
//   value?: null | string,
// }

// export interface SelectDropdown {
//   type: "SELECT_DROPDOWN";
//   label: string;
//   options: string[];
// }

// export interface IconOption {
//   type: "ICON_OPTION";
//   title:string,
//   options: {
//     image: string;
//     option: string;
//   }[];
// }

// export type REQUIREMENT_DATA_Type = DocumentUpload

// const data:any ={
//     stepType: "GENERAL",
//     stepName:"Portugal V7 VISA",
//     currentStep: 0,
//     totalStep: "7",
//     currentStepName:"Upload Documents",
//     stepSource: "CLIENT",
//     stepStatus: "IN_PROGRESS",
//     requirements: [
//       {
//         visaApplicationReqStatusId: 101,
//         question: "Upload your passport scan",
//         requirementType: "IMAGE",
//         required: true,
//         reqStatus: "SUBMITTED",
//         reason: "Document uploaded successfully",
//         value: "https://aws-bucket.com/passport_scan.jpg"
//       },
//       {
//         visaApplicationReqStatusId: 102,
//         question: "Provide your email address",
//         requirementType: "PDF",
//         required: true,
//         reqStatus: "VERIFIED",
//         reason: "Email verified",
//         value: "user@example.com"
//       },
//       {
//         visaApplicationReqStatusId: 103,
//         question: "Upload your recent medical report",
//         requirementType: "PDF",
//         required: true,
//         reqStatus: "RE_UPLOAD",
//         reason: "Blurry document, please re-upload",
//         value: null
//       },
//       {
//         visaApplicationReqStatusId: 104,
//         question: "Enter your date of birth",
//         requirementType: "PDF",
//         required: true,
//         reqStatus: "UPLOADED",
//         reason: "Awaiting user input",
//         value: null
//       }
//     ]
//   }

// const phases = ["IN_PROGRESS", "SUBMITTED", "APPROVED"] as const;
// export type Phase = (typeof phases)[number];

// const ApplicationMain = () => {
//   const { caseId } = useParams();

//   return (
//     <>
//       <Chatbot />

//       <div className="w-full h-full relative overflow-y-auto custom-scrollbar px-5 pb-16">

//         {/* Custom Stepper */}
//         <CustomStepper
//           visaType={data.stepName}
//           caseId={caseId}
//           currentStep={data.currentStep}
//           stepsCount={data.totalStep}
//           currentStepName={data.currentStepName}
//           stepStatus={data.stepStatus}
//         />

//         {/* Main Content based on phase and src */}
//         <StepPhase stepType={data.stepType}  phase={data.stepStatus} requirementData={data.requirements} />

//         <div className="flex justify-start mt-10 mx-2">
//           {data.stepStatus !== "APPROVED" && (
//             <button
//               className="px-10 py-2 bg-[#F6C328] text-black rounded-4xl cursor-pointer"
//             >
//               Next
//             </button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ApplicationMain;

import { useParams } from "react-router-dom";
import { useState } from "react";
import CustomStepper from "../../../components/CustomStepper";
import StepPhase from "../../../components/customer/StepPhase";
import Chatbot from "../../../components/customer/ Chatbot";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Box, Button, List, ListItem, ListItemText, Typography } from "@mui/material";

// Types
export interface StepsType {
  label: string;
}

export interface DocumentUpload {
  visaApplicationReqStatusId: string;
  question: string;
  requirementType: string;
  required: string;
  isUpload: boolean;
  reqStatus?: "NOT_UPLOADED" | "UPLOADED" | "VERIFIED" | "RE_UPLOAD";
  remarks?: string;
  value?: null | string;
}

export type REQUIREMENT_DATA_Type = DocumentUpload;

const phases = ["IN_PROGRESS", "SUBMITTED", "APPROVED"] as const;
export type Phase = (typeof phases)[number];

// Sample Steps (for now only 2 for example)
const stepsData: any = [
  {
    stepType: "GENERAL",
    stepName: "Portugal V7 VISA",
    currentStepName: "Upload Documents",
    stepSource: "CLIENT",
    requirements: [
      {
        visaApplicationReqStatusId: 101,
        question: "Upload your passport scan",
        requirementType: "IMAGE",
        required: true,
        reqStatus: "UPLOADED",
        reason: "",
        value: "https://aws-bucket.com/passport_scan.jpg",
      },
      {
        visaApplicationReqStatusId: 102,
        question: "Provide your email address",
        requirementType: "PDF",
        required: true,
        reqStatus: "VERIFIED",
        reason: "Email verified",
        value: "user@example.com",
      },
      {
        visaApplicationReqStatusId: 103,
        question: "Upload your recent medical report",
        requirementType: "PDF",
        required: true,
        reqStatus: "RE_UPLOAD",
        reason: "Blurry document, please re-upload",
        value: null,
      },
      {
        visaApplicationReqStatusId: 104,
        question: "Enter your date of birth",
        requirementType: "PDF",
        required: true,
        reqStatus: "UPLOADED",
        reason: "",
        value: null,
      },
    ],
  },
  {
    stepType: "GENERAL",
    stepName: "Portugal V7 VISA",
    currentStepName: "NIF Request & Confirmation",
    stepSource: "ADMIN",
    requirements: [
      {
        visaApplicationReqStatusId: 201,
        question: "NIF Document",
        requirementType: "PDF",
        required: true,
        reqStatus: "NOT_UPLOADED",
        reason: "",
        value: null,
      },
    ],
  },
  {
    stepType: "BANK",
    stepName: "Portugal V7 VISA",
    currentStepName: "Bank Account Opening & Confirmation",
    stepSource: "CLIENT",
    requirements: [
      {
        visaApplicationReqStatusId: 201,
        question: "NIF Document",
        requirementType: "PDF",
        required: true,
        reqStatus: "NOT_UPLOADED",
        reason: "",
        value: null,
      },
    ],
  },
  {
    stepType: "GENERAL",
    stepName: "Portugal V7 VISA",
    currentStepName: "Visa Submission & Processing",
    stepSource: "ADMIN",
    requirements: [
      {
        visaApplicationReqStatusId: 201,
        question: "NIF Document",
        requirementType: "PDF",
        required: true,
        reqStatus: "NOT_UPLOADED",
        reason: "",
        value: null,
      },
    ],
  },
  {
    stepType: "GENERAL",
    stepName: "Portugal V7 VISA",
    currentStepName: "VISA Approval",
    stepSource: "ADMIN",
    requirements: [
      {
        visaApplicationReqStatusId: 201,
        question: "NIF Document",
        requirementType: "PDF",
        required: true,
        reqStatus: "NOT_UPLOADED",
        reason: "",
        value: null,
      },
    ],
  },
];

const ApplicationMain = () => {
  const { caseId } = useParams();

  // State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const currentStep = stepsData[currentStepIndex];
  const currentPhase: Phase = phases[phaseIndex];

  // Handlers
  const handleNextClick = () => {
    if (phaseIndex < phases.length - 1) {
      setPhaseIndex((prev) => prev + 1); // Move to next phase
    } else if (currentStepIndex < stepsData.length - 1) {
      setCurrentStepIndex((prev) => prev + 1); // Move to next step
      setPhaseIndex(0); // Reset phase
    }
  };

  const isFinalPhase = phaseIndex === phases.length - 1;
  // const isLastStep = currentStepIndex === stepsData.length - 1;

  return (
    <>
      <Chatbot />

      <div className="w-full h-full relative overflow-y-auto custom-scrollbar px-5 pb-16">
        <CustomStepper
          visaType={currentStep.stepName}
          caseId={caseId}
          currentStep={currentStepIndex}
          stepsCount={stepsData.length.toString()}
          currentStepName={currentStep.currentStepName}
          stepStatus={currentPhase}
        />

        {currentStep.currentStepName === "VISA Approval" ? (
          <>
            <div className="flex flex-col items-center justify-center text-center mt-24">
              <div className="rounded-full border-[20px] border-golden-yellow-50 w-fit">
                <div className="rounded-full border-[15px] border-[#FEFCEA]">
                  <div className="text-neutrals-50 bg-[#FAE081] p-8 rounded-full">
                    <DoneAllIcon sx={{ color: "black", fontSize: 100 }} />
                  </div>
                </div>
              </div>

              
              <p className="mt-4 text-lg">Congratulations! Your D7 visa has been approved.</p>
              <p className="mt-4 text-lg"> Download your visa and check the next steps below.</p>

              {/* Continue Button */}
              <Button
                variant="outlined"
                sx={{
                  borderColor: "black",
                  my: 5,
                  color: "black",
                  borderRadius: "15px",
                  textTransform: "none",
                  px: 6,
                  py: 1,
                }}
              >
                Download VISA PDF
              </Button>
            </div>
            <Box
      sx={{
        backgroundColor: '#f9f8f8',
        borderRadius: '20px',
        padding: '24px',
        width: '80vw',
        maxWidth: 512,
        boxSizing: 'border-box',
      }}
    >
      <Typography sx={{ fontSize: 14, color: '#333', mb: 1 }}>
        Here’s what to do next:
      </Typography>
      <List dense disablePadding>
        <ListItem sx={{ pl: 1, py: 0.5 }}>
          <ListItemText primary="Plan your travel to Portugal." primaryTypographyProps={{ fontSize: 14, color: '#444' }} />
        </ListItem>
        <ListItem sx={{ pl: 1, py: 0.5 }}>
          <ListItemText primary="SEF appointment booking for residency card." primaryTypographyProps={{ fontSize: 14, color: '#444' }} />
        </ListItem>
        <ListItem sx={{ pl: 1, py: 0.5 }}>
          <ListItemText primary="Residency card processing & compliance." primaryTypographyProps={{ fontSize: 14, color: '#444' }} />
        </ListItem>
      </List>
    </Box>
          </>
        ) : (
          <>
            <StepPhase
              onContinue={handleNextClick}
              stepType={currentStep.stepType}
              phase={currentPhase}
              requirementData={currentStep.requirements}
              stepSource={currentStep.stepSource}
              currentStepName={currentStep.currentStepName}
            />

            <div className="flex justify-start mt-10 mx-2">
              {!isFinalPhase && (
                <button
                  onClick={handleNextClick}
                  className="px-10 py-2 bg-[#F6C328] text-black rounded-4xl cursor-pointer"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ApplicationMain;
