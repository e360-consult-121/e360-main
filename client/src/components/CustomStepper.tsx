import { Icon } from "@iconify/react";

const steps = [
  { label: "Upload Documents" },
  { label: "Trade Name Reservation & Confirmation" },
  { label: "Step 3" },
  { label: "Step 4" },
  { label: "Step 5" },
  { label: "Step 6" },
  { label: "Step 7" },
];

const CustomStepper = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex items-center relative">
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

            {index == currentStep && (
              <div className="absolute top-12 w-fit max-w-[250px]">
                <div
                  className={`relative px-3 py-2 w-full  bg-golden-yellow-100 rounded-2xl  text-center text-neutrals-950 ${
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
  );
};

export default CustomStepper;
