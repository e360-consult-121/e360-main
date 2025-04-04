import {Phase} from "../../pages/customer/dashboard/ApplicationMain";
import Requirements from "./Requirements";
import Submitted from "./Submitted";

const StepPhase: React.FC<{ phase: Phase; requirementData: any}> = ({
  phase,
  requirementData,
}) => {
  if (phase === "APPROVED") {
    return <Submitted />;
  }
  if(phase === "IN_PROGRESS" || phase === "SUBMITTED"){
     return <Requirements phase={phase} requirementData={requirementData} />
  }
};

export default StepPhase;
