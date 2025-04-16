import {Phase} from "../../pages/customer/dashboard/ApplicationMain";
import Requirements from "./Requirements";
import Approved from "./Approved";
import TradeNameApproved from "./TradeNameApproved";

const StepPhase: React.FC<{ phase: Phase; requirementData: any , stepType:string}> = ({
  phase,
  requirementData,
  stepType
}) => {
  if(stepType === "TRADE_NAME"){
    return <TradeNameApproved />
  }
  else{
    if (phase === "APPROVED") {
      return <Approved />;
    }
  }
  if(phase === "IN_PROGRESS" || phase === "SUBMITTED"){
     return <Requirements stepType={stepType} phase={phase} requirementData={requirementData} />
  }
};

export default StepPhase;
