import { useParams } from "react-router-dom";
import CustomStepper from "../../../components/CustomStepper";

// This is the application of different visa types
export interface StepsType {
  label: string;
}

const steps = [
  { label: "Upload Documents" },
  { label: "Trade Name Reservation & Confirmation" },
  { label: "Step 3" },
  { label: "Step 4" },
  { label: "Step 5" },
  { label: "Step 6" },
  { label: "Step 7" },
];

const SingleVisaApplication = () => {
  const { caseId } = useParams();

  return (
    <>
      {/* <Chatbot /> */}

      <div className="w-full h-full relative overflow-y-auto custom-scrollbar px-5 pb-16">

        <CustomStepper
          visaType={"Portugal V7 VISA"}
          caseId={caseId}
          currentStep={0}
          steps={steps}
        />
      </div>
    </>
  );
};

export default SingleVisaApplication;
