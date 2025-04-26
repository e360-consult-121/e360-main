import { Phase } from "../../../pages/customer/dashboard/VisaApplicationProcess";
import Requirements from "./Requirements";
import Approved from "./Approved";
import TradeNameApproved from "./TradeName/TradeNameApproved";
import AdminStepSource from "./ProcessComponent";
import MedicalApproved from "./Medical/MedicalApproved";
import AIMAClientComponent from "./AIMA_Appointment/AIMAClientComponent";
import VisaCompletionPortugal from "./VisaCompletionComponents/VisaCompletionPortugal";

const StepPhase: React.FC<{
  phase: Phase;
  requirementData: any;
  stepType: string;
  onContinue: () => void;
  stepSource: string;
  stepStatus: string;
  refetch: () => void;
  onSubmit: () => void;
}> = ({
  phase,
  requirementData,
  stepType,
  onContinue,
  stepSource,
  stepStatus,
  refetch,
  onSubmit,
}) => {
  if(stepType === "DGDELIVERY"){
    return<>
    <VisaCompletionPortugal />
    </>
  }
  else if (phase === "APPROVED") {
    if (stepType === "TRADE_NAME") {
      return <TradeNameApproved onContinue={onContinue} />;
    } else if (stepType === "GENERAL") {
      return <Approved onContinue={onContinue} />;
    } else if (stepType === "MEDICAL") {
      return <MedicalApproved onContinue={onContinue} />;
    }
  }
  else if (phase === "IN_PROGRESS" || phase === "SUBMITTED") {
    if(stepType === "AIMA_APPOINTMENT"){
      {requirementData.map((req:any) => (
        <AIMAClientComponent 
        key={req.reqStatusId}
        label={req.question}
        status={req.reqStatus}
        date ="13 Feb 2025, 12:30 P.M." 
        />
      ))}
    }
    else if (stepSource === "ADMIN"){
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
