import { useParams } from "react-router-dom";
import CustomStepper from "../../../components/CustomStepper";
import StepPhase from "../../../components/customer/StepPhase";
import Chatbot from "../../../components/customer/ Chatbot";

// This is the application of different visa types
export interface StepsType {
  label: string;
}

export interface DocumentUpload {
  visaApplicationReqStatusId:string,
  question: string;
  requirementType: string;
  required: string;
  isUpload: boolean;
  reqStatus?: "NOT_UPLOADED" | "UPLOADED" | "VERIFIED" | "RE_UPLOAD";
  remarks?: string;
  value?: null | string,
}

export interface SelectDropdown {
  type: "SELECT_DROPDOWN";
  label: string;
  options: string[];
}

export interface IconOption {
  type: "ICON_OPTION";
  title:string,
  options: {
    image: string;
    option: string;
  }[];
}

export type REQUIREMENT_DATA_Type = DocumentUpload

const data:any ={
    stepType: "GENERAL",
    stepName:"Portugal V7 VISA",
    currentStep: 0,
    totalStep: "7",
    currentStepName:"Upload Documents",
    stepSource: "CLIENT",
    stepStatus: "IN_PROGRESS",
    requirements: [
      { 
        visaApplicationReqStatusId: 101,
        question: "Upload your passport scan",
        requirementType: "IMAGE",
        required: true,
        reqStatus: "SUBMITTED",
        reason: "Document uploaded successfully",
        value: "https://aws-bucket.com/passport_scan.jpg"
      },
      {
        visaApplicationReqStatusId: 102,
        question: "Provide your email address",
        requirementType: "PDF",
        required: true,
        reqStatus: "VERIFIED",
        reason: "Email verified",
        value: "user@example.com"
      },
      {
        visaApplicationReqStatusId: 103,
        question: "Upload your recent medical report",
        requirementType: "PDF",
        required: true,
        reqStatus: "RE_UPLOAD",
        reason: "Blurry document, please re-upload",
        value: null
      },
      {
        visaApplicationReqStatusId: 104,
        question: "Enter your date of birth",
        requirementType: "PDF",
        required: true,
        reqStatus: "UPLOADED",
        reason: "Awaiting user input",
        value: null
      }
    ]
  }

const phases = ["IN_PROGRESS", "SUBMITTED", "APPROVED"] as const;
export type Phase = (typeof phases)[number];

const ApplicationMain = () => {
  const { caseId } = useParams();

  return (
    <>
      <Chatbot />

      <div className="w-full h-full relative overflow-y-auto custom-scrollbar px-5 pb-16">

        {/* Custom Stepper */}
        <CustomStepper
          visaType={data.stepName}
          caseId={caseId}
          currentStep={data.currentStep}
          stepsCount={data.totalStep}
          currentStepName={data.currentStepName}
          stepStatus={data.stepStatus}
        />

        {/* Main Content based on phase and src */}
        <StepPhase phase={data.stepStatus} requirementData={data.requirements} />

        <div className="flex justify-start mt-10 mx-2">
          {data.stepStatus !== "APPROVED" && (
            <button
              className="px-10 py-2 bg-[#F6C328] text-black rounded-4xl cursor-pointer"
            >
              Next 
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ApplicationMain;
