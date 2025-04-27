import { Phase } from "../../../pages/customer/dashboard/VisaApplicationProcess";
import Requirements from "./Requirements";
import Approved from "./Approved";
import TradeNameApproved from "./TradeName/TradeNameApproved";
import AdminStepSource from "./ProcessComponent";
import MedicalApproved from "./Medical/MedicalApproved";
import AIMAClientComponent from "./AIMA_Appointment/AIMAClientComponent";
import VisaCompletionPortugal from "./VisaCompletionComponents/VisaCompletionPortugal";
import BankDetails from "./Bank/BankDetails";
import DGInvestmentMain from "../../admin/visaApplicationInformation/DGInvestment/DGInvestmentMain";

const StepPhase: React.FC<{
  phase: Phase;
  visaType: string;
  visaApplicationId: string;
  requirementData: any;
  currentStepName: string;
  stepData: any;
  stepType: string;
  onContinue: () => void;
  stepSource: string;
  stepStatus: string;
  refetch: () => void;
  onSubmit: () => void;
}> = ({
  phase,
  visaType,
  visaApplicationId,
  requirementData,
  currentStepName,
  stepType,
  onContinue,
  stepData,
  stepSource,
  stepStatus,
  refetch,
  onSubmit,
}) => {
  if (stepType === "DGDELIVERY") {
    return (
      <>
        <VisaCompletionPortugal />
      </>
    );
  } else if (stepType === "DGINVESTMENT") {
    return <DGInvestmentMain visaApplicationId={visaApplicationId} visaType={visaType} stepData={stepData} onContinue={onContinue} currentStepName={currentStepName} />;
  } else if (phase === "APPROVED" && stepType !== "AIMA") {
    if (stepType === "TRADE_NAME") {
      return <TradeNameApproved onContinue={onContinue} />;
    }
    if (stepType === "BANK") {
      return (
        <BankDetails
          onContinue={onContinue}
          requirementData={requirementData}
        />
      );
    } else if (stepType === "GENERAL" || stepType === "EMPTY") {
      return (
        <Approved
          stepSource={stepSource}
          requirementData={requirementData}
          currentStepName={currentStepName}
          onContinue={onContinue}
        />
      );
    } else if (stepType === "MEDICAL") {
      return <MedicalApproved onContinue={onContinue} />;
    }
  } else if (
    phase === "IN_PROGRESS" ||
    phase === "SUBMITTED" ||
    phase === "APPROVED"
  ) {
    if (stepType === "AIMA") {
      return (
        <>
          {stepData?.aimaDocs && (
            <AIMAClientComponent
              aimaDocs={stepData.aimaDocs}
              approved={phase === "APPROVED"}
              onContinue={onContinue}
            />
          )}
        </>
      );
    } else if (stepSource === "ADMIN") {
      return (
        <div>
          <AdminStepSource
            label="Request in Progress"
            date="13 Feb 2025, 12:30 P.M."
            status="in_progress"
          />
        </div>
      );
    }

    return (
      <Requirements
        stepStatus={stepStatus}
        stepType={stepType}
        phase={phase}
        requirementData={requirementData}
        refetch={refetch}
        onSubmit={onSubmit}
      />
    );
  }
};

export default StepPhase;
