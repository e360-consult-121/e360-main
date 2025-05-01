import { Icon } from "@iconify/react";

type CustomStepperProps = {
  visaType: string;
  currentStep: number;
  visaApplicationId?: string;
  stepsCount: number;
  currentStepName: string;
};

const CustomStepper = ({
  visaType,
  currentStep,
  visaApplicationId,
  stepsCount,
  currentStepName,
}: CustomStepperProps) => {
  return (
    <>
      <div className="w-full flex flex-col items-center text-neutrals-950">
        <h1 className="text-xl font-bold">{visaType}</h1>
        <p className="text-sm">Case ID - {visaApplicationId}</p>
      </div>
      
      {/* Responsive Stepper */}
      <div className="w-full overflow-x-auto pb-16 pt-6">
        <div 
          className="flex justify-center items-center relative mx-auto" 
          style={{ 
            minWidth: "fit-content", 
            maxWidth: "100%",
            width: stepsCount > 5 ? "100%" : "auto"
          }}
        >
          {Array.from({ length: stepsCount }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold border-[5px] relative
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
                  <div className="absolute top-12 w-max max-w-[250px] z-10">
                    <div
                      className={`relative px-3 py-2 w-full bg-golden-yellow-100 rounded-2xl text-center text-neutrals-950 whitespace-normal`}
                    >
                      {currentStepName}
                      <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-golden-yellow-100"></div>
                    </div>
                  </div>
                )}
              </div>
              {index !== stepsCount - 1 && (
                <div
                  className={`h-4 ${
                    index < currentStep
                      ? "bg-golden-yellow-100"
                      : "bg-neutrals-50"
                  }`}
                  style={{ 
                    width: stepsCount > 5 ? `${100/(stepsCount-1)}%` : "30px", 
                    minWidth: "35px",
                    maxWidth: "60px"
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomStepper;