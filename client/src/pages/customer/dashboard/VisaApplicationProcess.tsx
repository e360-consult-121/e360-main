import { useParams } from "react-router-dom";
import CustomStepper from "../../../components/CustomStepper";
import StepPhase from "../../../components/customer/visaApplicationProcess/StepPhase";
import Chatbot from "../../../components/customer/Chatbot";
import { useEffect, useState } from "react";
import {
  RequirementTypes,
  StepData,
} from "../../../features/customer/applicationMain/applicationMainTypes";
import {
  useGetCurrentStepInfoQuery,
  useMoveToNextStepMutation,
  useStepSubmitMutation,
} from "../../../features/common/commonApi";

export interface SelectDropdown {
  type: "SELECT_DROPDOWN";
  label: string;
  options: string[];
}

export interface IconOption {
  type: "ICON_OPTION";
  title: string;
  options: {
    image: string;
    option: string;
  }[];
}

export function canProceedToNextStep(
  requirements?: RequirementTypes[]
): boolean {
  if (!requirements) return false;
  return requirements
    .filter((req) => req.required === true)
    .every((req) => req.reqStatus === "UPLOADED");
}

const phases = ["IN_PROGRESS", "SUBMITTED", "APPROVED"] as const;
export type Phase = (typeof phases)[number];

const VisaApplicationProcess = () => {
  const { visaApplicationId } = useParams();
  const [currentStepInfo, setCurrentStepInfo] = useState<StepData>();
  const [commonInfo, setCommonInfo] = useState<any>(null);

  const { data, refetch, error, isLoading } =
    useGetCurrentStepInfoQuery(visaApplicationId);
  const [stepSubmit] = useStepSubmitMutation();
  const [moveToNextStep] = useMoveToNextStepMutation();

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch step info:", error);
    }

    if (!isLoading && data) {
      setCurrentStepInfo(data.stepData);
      setCommonInfo(data.commonInfo);
    }
  }, [error, isLoading, data]);

  // Handle Moving to Next Step
  const handleContinueClick = async () => {
    if (!visaApplicationId) return;

    try {
      const response = await moveToNextStep(visaApplicationId).unwrap();
      console.log("Moved to next step:", response);

      const { data: updatedData } = await refetch();
      if (updatedData) {
        setCurrentStepInfo(updatedData.stepData);
        setCommonInfo(updatedData.commonInfo);
      }
    } catch (err) {
      console.error("Failed to move to next step:", err);
    }
  };

  // Handle Moving to Next Phase
  const handleSubmitDocButton = async () => {
    if (!visaApplicationId) return;

    try {
      const response = await stepSubmit(visaApplicationId).unwrap();
      console.log("Step submitted:", response);
      alert("Document submitted");
      refetch();
    } catch (err) {
      console.error("Failed to submit step:", err);
    }
  };

  return (
    <>
      <Chatbot />

      <div className="w-full relative overflow-y-auto custom-scrollbar px-5 pb-16">
        {/* Custom Stepper */}
        {commonInfo && currentStepInfo && (
          <CustomStepper
            visaType={commonInfo.visaTypeName}
            visaApplicationId={visaApplicationId}
            currentStepName={commonInfo.currentStepName}
            currentStep={commonInfo.currentStepNumber - 1}
            stepsCount={commonInfo.totalSteps}
            stepStatus={currentStepInfo.stepStatus}
          />
        )}

        {/* Main Content based on phase and src */}
        {currentStepInfo && (
          <StepPhase
            currentStepName={commonInfo.currentStepName}
            stepType={currentStepInfo.stepType}
            phase={
              currentStepInfo.stepStatus as
                | "IN_PROGRESS"
                | "SUBMITTED"
                | "APPROVED"
            }
            stepData={currentStepInfo}
            requirementData={currentStepInfo.requirements}
            onContinue={handleContinueClick}
            stepSource={currentStepInfo.stepSource}
            stepStatus={currentStepInfo.stepStatus}
            onSubmit={handleSubmitDocButton}
            refetch={refetch}
          />
        )}
      </div>
    </>
  );
};

export default VisaApplicationProcess;
