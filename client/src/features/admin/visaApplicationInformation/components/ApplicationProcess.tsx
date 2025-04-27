import { Box } from "@mui/material";
import StepItem from "./StepItem";
import RequirementList from "./RequirementList";
import { useApproveStepMutation, useMarkAsVerifiedMutation, useNeedsReUploadMutation, useRejectStepMutation } from "../visaApplicationInformationApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { StepData } from "../visaAppicationInformationTypes";
import { useGetCurrentStepInfoQuery } from "../../../common/commonApi";

interface CommonInfo {
  visaTypeName: string;
  currentStepName: string;
  totalSteps: number;
  currentStepNumber: number;
  stepNames: string[];
}

const ApplicationProcess = () => {
  const { visatype } = useParams();
  const [stepData, setStepData] = useState<StepData>();
  const [commonInfo, setCommonInfo] = useState<CommonInfo>({
    visaTypeName: "",
    currentStepName: "",
    totalSteps: 0,
    currentStepNumber: 0,
    stepNames: []
  });

  const visaApplicationId = visatype;
  const { data, error, isLoading, refetch } = useGetCurrentStepInfoQuery(visaApplicationId);
  const [approveStep] = useApproveStepMutation();
  const [markAsVerified] = useMarkAsVerifiedMutation();
  const [rejectStep] = useRejectStepMutation();
  const [needsReUpload] = useNeedsReUploadMutation();

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch step info:", error);
    }

    if (!isLoading && data) {
      setStepData(data.stepData);
      
      // Set the common info from the API response
      if (data.commonInfo) {
        setCommonInfo(data.commonInfo);
      }
    }
  }, [error, isLoading, data]);

  const handleApprove = async () => {
    try {
      const response = await approveStep(visatype).unwrap();
      console.log("Approved", response);
      alert("Approved Step");
      refetch();
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await rejectStep(visatype).unwrap();
      console.log("Rejected", response);
      alert("Rejected the Step");
      refetch();
    } catch (error) {
      console.error("Rejection failed", error);
    }
  };

  const handleMarkAsVerified = async (reqStatusId: string) => {
    try {
      console.log(reqStatusId);
      const response = await markAsVerified(reqStatusId).unwrap();
      alert("Verified");
      console.log("Marked as verified", response);
      refetch();
    } catch (error) {
      console.error("Marking as verified failed", error);
    }
  };

  const handleNeedsReUpload = async ({
    reqStatusId,
    reason,
  }: {
    reqStatusId: string;
    reason: string;
  }) => {
    try {
      console.log(reqStatusId, reason);
      await needsReUpload({ reqStatusId, reason }).unwrap();
      alert("Send document for reupload");
      refetch();
    } catch (error) {
      console.error("Re-upload request failed", error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {commonInfo.stepNames.map((step: string, index: number) => {
        const currentStepNumber = commonInfo.currentStepNumber ?? 0;
        const isActive = index === (currentStepNumber - 1);
        const requirements = stepData?.requirements ?? [];
        const stepType = stepData?.stepType ?? "";
        const stepStatusId = stepData?.stepStatusId ?? "";
        
        return (
          <StepItem
            key={index}
            step={step}
            index={index}
            isActive={isActive}
            stepStatus={stepData?.stepStatus ?? ""}
            currentStepIndex={currentStepNumber - 1}
            requirements={requirements}
            showRequirements={
              isActive ? (
                <RequirementList
                  visaApplicationId={visaApplicationId??""}
                  stepSource={stepData?.stepSource ?? ""}
                  onMarkAsVerified={handleMarkAsVerified}
                  onNeedsReUpload={handleNeedsReUpload}
                  requirements={requirements}
                  stepData={stepData}
                  stepType={stepType}
                  refetch={refetch}
                  stepStatusId={stepStatusId}
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