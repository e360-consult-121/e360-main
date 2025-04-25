import { Box } from "@mui/material";
import StepItem from "./StepItem";
import RequirementList from "./RequirementList";
import { useApproveStepMutation, useGetCurrentStepInfoQuery, useMarkAsVerifiedMutation, useNeedsReUploadMutation, useRejectStepMutation } from "../visaApplicationInformationApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { StepData } from "../visaAppicationInformationTypes";




const steps: any = [
  "Uploaded Documents",
  "NIF Request & Confirmation",
  "Bank Account Opening & Confirmation",
  "Visa Submission & Processing",
  "Upload Passport",
  "VISA Approval"
];

const ApplicationProcess = () => {
  const { visatype } = useParams();

  const [currentStepInfo, setCurrentStepInfo] = useState<StepData>();


  const visaApplicationId = visatype;
  const { data, error, isLoading , refetch} = useGetCurrentStepInfoQuery(visaApplicationId);
  const [approveStep] = useApproveStepMutation();
  const [markAsVerified] = useMarkAsVerifiedMutation();
  const [rejectStep] = useRejectStepMutation();
  const [needsReUpload] = useNeedsReUploadMutation()

   useEffect(() => {
      // console.log(currentStepInfo);
      if (error) {
        console.error("Failed to fetch step info:", error);
      }
  
      if (!isLoading && data) {
        setCurrentStepInfo(data.stepData);
      }
    }, [error, isLoading, data]);

  const handleApprove = async () => {
    try {
      const response = await approveStep(visatype).unwrap();
      console.log("Approved", response);
      alert("Approved Step")
      refetch();
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await rejectStep(visatype).unwrap();
      console.log("Rejected", response);
      alert("Rejected the Step")
      refetch();
    } catch (error) {
      console.error("Rejection failed", error);
    }
  };

  const handleMarkAsVerified = async (reqStatusId:string) => {
    try {
      console.log(reqStatusId)
      const response = await markAsVerified(reqStatusId).unwrap();
      alert("Verified")
      console.log("Marked as verified", response);
      refetch()
    } catch (error) {
      console.error("Marking as verified failed", error);
    }
  };

  const handleNeedsReUpload = async({
    reqStatusId,
    reason,
  }: {
    reqStatusId: string;
    reason: string;
  }) => {
    try {
      console.log(reqStatusId,reason)
      await needsReUpload({reqStatusId, reason }).unwrap(); 
      alert("Send document for reupload")
      refetch()
    } catch (error) {
           console.error("Re-upload request failed", error); 
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {steps.map((step: any, index: number) => {
        const currentStep = currentStepInfo?.currentStep ?? 0;
        const isActive = index === (currentStep - 1);
        const requirements = currentStepInfo?.requirements ?? [];
        const stepType =  currentStepInfo?.stepType ?? ""
        return (
          <StepItem
            key={index}
            step={step}
            index={index}
            isActive={isActive}
            currentStepIndex={currentStep - 1}
            requirements={requirements}
            showRequirements={
              isActive ? (
                <RequirementList
                  stepSource={currentStepInfo?.stepSource ?? ""}
                  onMarkAsVerified={handleMarkAsVerified}
                  onNeedsReUpload={handleNeedsReUpload}
                  requirements={requirements}
                  stepType={stepType}
                  refetch={refetch}
                />
              ) : null
            }
            onApprove={handleApprove}
            onReject={handleReject}
          />
        );
      })}
    </Box>
  );
};

export default ApplicationProcess;
