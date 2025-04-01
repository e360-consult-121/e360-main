import { Phase } from "../CustomStepper";
import Requirements from "./Requirements";
import Submitted from "./Submitted";

const StepPhase: React.FC<{ phase: Phase }> = ({ phase }) => {
  if (phase === "IN_PROGRESS") {
    return (
      <div>
        <Requirements phase="IN_PROGRESS" />
      </div>
    );
  }

  if (phase === "SUBMITTED") {
    return (
      <div>
        <Requirements phase="SUBMITTED" />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Submitted />
    </div>
  );
};

export default StepPhase;
