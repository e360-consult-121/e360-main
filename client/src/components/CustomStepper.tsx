import { Icon } from "@iconify/react";
import { StepsType } from "../pages/customer/dashboard/SingleVisaApplication";
import React, { useState } from "react";
import StepPhase from "./customer/StepPhase";


type CustomStepperProps = {
  visaType: string;
  currentStep: number;
  caseId?: string;
  steps: StepsType[];
};

const phases = ["IN_PROGRESS", "SUBMITTED", "APPROVED"] as const;
export type Phase = (typeof phases)[number];

const CustomStepper: React.FC<CustomStepperProps> = ({ visaType, currentStep, caseId, steps }) => {

  const [stepPhases, setStepPhases] = useState<Phase[]>(Array(steps.length).fill("IN_PROGRESS"));

  const changePhase = () => {
    setStepPhases((prevPhases) => {
      const newPhases = [...prevPhases];
      const nextPhaseIndex = (phases.indexOf(newPhases[currentStep]) + 1) % phases.length;
      newPhases[currentStep] = phases[nextPhaseIndex];
      return newPhases;
    });
  };

  return (
    <>
      <div className="w-full flex flex-col items-center text-neutrals-950">
        <h1 className="text-xl font-bold">{visaType}</h1>
        <p className="text-sm">Case ID - {caseId}</p>
      </div>
      <div className="w-full justify-center my-10 flex items-center relative">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold border-[5px]
        ${
          index <= currentStep
            ? "bg-golden-yellow-300 text-black border-white"
            : "bg-neutrals-300 text-white border-neutrals-100"
        }
        `}
            >
              {index < currentStep ? (
                <Icon
                  icon="icon-park-outline:done-all"
                  width={"17px"}
                  height={"17px"}
                />
              ) : (
                index + 1
              )}
              {index === currentStep && (
                <div className="absolute top-12 w-fit max-w-[250px]">
                  <div
                    className={`relative px-3 py-2 w-full bg-golden-yellow-100 rounded-2xl text-center text-neutrals-950 ${
                      step.label.length >= 17 ? "text-wrap" : "text-nowrap"
                    }`}
                  >
                    {step.label}
                    <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-golden-yellow-100"></div>
                  </div>
                </div>
              )}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`h-4 w-30 ${
                  index < currentStep ? "bg-golden-yellow-100" : "bg-neutrals-50"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
      <div className="w-full text-center mt-28">
        <h2 className="text-neutrals-950">
          To begin your {visaType}, please upload the required documents.
        </h2>
      </div>

      {/* Main Content based on phase */}
      <StepPhase phase={stepPhases[currentStep]} />
      
      <div className="flex justify-start mt-10 mx-2">
        <button onClick={changePhase} className="px-10 py-2 bg-yellow-500 text-white rounded-4xl cursor-pointer"
        // disabled={true}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default CustomStepper;
