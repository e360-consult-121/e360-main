import { useParams } from "react-router-dom";
import CustomStepper from "../../../components/CustomStepper";
import Chatbot from "../../../components/ Chatbot";
import FileUploadComp from "../../../components/FileUploadComp";

// This is the application of different visa types
const SingleVisaApplication = () => {
  const { caseid } = useParams();

  return (
    <>
      <Chatbot />

      <div className="w-full h-full relative overflow-y-auto custom-scrollbar px-5 pb-16">
        <div className="w-full flex flex-col items-center text-neutrals-950">
          <h1 className="text-xl font-bold">Dubai Business Setup</h1>
          <p className="text-sm">Case ID - {caseid}</p>
        </div>

        <div className="w-full flex justify-center my-10">
          <CustomStepper currentStep={1} />
        </div>

        <div className="w-full text-center mt-28">
          <h2 className="text-neutrals-950">
            To begin your Portugal D7 application, please upload the required
            documents.
          </h2>
        </div>

        {/* Main content section */}
        <div className="mt-7">
          <p className="text-neutrals-950 text-sm font-semibold">Documents</p>

          <div className="flex flex-col mt-6 overflow-y-auto h-56 custom-scrollbar">
            <FileUploadComp />
            <FileUploadComp />
            <FileUploadComp />
            <FileUploadComp />

            <FileUploadComp />
            <FileUploadComp />
            <FileUploadComp />
          </div>

          <div className="mt-3 space-y-2">
            <p className="text-xs text-neutrals-950">Business Activity*</p>

            <select className="text-neutrals-400 bg-neutrals-50 w-72 px-4 py-2 rounded-md">
              <option>Select your Business Activity</option>
              <option>Activity 1</option>
              <option>Activity 2</option>
            </select>
          </div>

          <button className=" bg-neutrals-200 text-neutrals-950 px-4 py-3 rounded-2xl mt-7">
            Submit Documents
          </button>
        </div>
      </div>
    </>
  );
};

export default SingleVisaApplication;
