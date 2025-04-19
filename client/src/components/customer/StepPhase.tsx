import {Phase} from "../../pages/customer/dashboard/ApplicationMain";
import Requirements from "./Requirements";
import Approved from "./Approved";
import TradeNameApproved from "./TradeNameApproved";
import AdminStepSource from "./AdminStepSource";

const StepPhase: React.FC<{ phase: Phase; requirementData: any , stepType:string ,onContinue: () => void,stepSource:string,currentStepName:string}> = ({
  phase,
  requirementData,
  stepType,
  onContinue,
  stepSource,
  currentStepName
}) => {
  if(stepType === "TRADE_NAME") {
    return <TradeNameApproved />
  }
  else{
    if (phase === "APPROVED") {
      return <Approved onContinue={onContinue} />;
    }
  }
  if(phase === "IN_PROGRESS" || phase === "SUBMITTED"){
    if(stepSource === "ADMIN" && phase === "IN_PROGRESS"){
      return(
        <div>
          <AdminStepSource 
          label="Final Review by Legal Team"
          date="13 Feb 2025, 12:30 P.M."
          status="in_progress"
          />
        </div>
      )  
    }
    if(stepSource === "ADMIN" && phase === "SUBMITTED"){
      if(currentStepName === "Visa Submission & Processing"){
        return(
          <>
          {/* <AdminStepSource 
          label="Visa Approved"
          date="13 Feb 2025, 12:30 P.M."
          status="completed"
          />
          <AdminStepSource 
          label="Appointment Confirmed"
          date="13 Feb 2025, 12:30 P.M."
          status="completed"
          /> */}
          <AdminStepSource 
          label="Application Approved"
          date="13 Feb 2025, 12:30 P.M."
          status="completed"
          />
          </>
        )
      }
      return(
        <div>
          <AdminStepSource 
          label="Request in Progress"
          date="13 Feb 2025, 12:30 P.M."
          status="in_progress"
          />
        </div>
      )
    }
     return <Requirements stepType={stepType} phase={phase} requirementData={requirementData} />
  }
};

export default StepPhase;
