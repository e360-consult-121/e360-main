import { Phase } from "../../../pages/customer/dashboard/VisaApplicationProcess";
import Requirements from "./Requirements";
import Approved from "./Approved";
import TradeNameApproved from "./TradeName/TradeNameApproved";
import AdminStepSource from "./AdminStepSource";
import MedicalApproved from "./Medical/MedicalApproved";

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
  if (stepType === "TRADE_NAME") {
    if(phase === "APPROVED")
    return <TradeNameApproved />;
  } else if (stepType === "GENERAL"){
    if (phase === "APPROVED") {
      return <Approved onContinue={onContinue} />;
    }
  }
  else if(stepType === "MEDICAL"){
    if(phase === "APPROVED"){
      return <MedicalApproved onContinue={onContinue}/>
    }
  }
  if (phase === "IN_PROGRESS" || phase === "SUBMITTED") {
    if (stepSource === "ADMIN" && phase === "IN_PROGRESS") {
      return (
        <div>
          <AdminStepSource
            label="Final Review by Legal Team"
            date="13 Feb 2025, 12:30 P.M."
            status="in_progress"
          />
        </div>
      );
    }
    if (stepSource === "ADMIN" && phase === "SUBMITTED") {
      // if(currentStepName === "Visa Submission & Processing"){
      // return(
      // <>
      {
        /* <AdminStepSource 
          label="Visa Approved"
          date="13 Feb 2025, 12:30 P.M."
          status="completed"
          />
          <AdminStepSource 
          label="Appointment Confirmed"
          date="13 Feb 2025, 12:30 P.M."
          status="completed"
          /> */
      }
      //   <AdminStepSource
      //   label="Application Approved"
      //   date="13 Feb 2025, 12:30 P.M."
      //   status="completed"
      //   />
      //   </>
      // )
      // }
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
