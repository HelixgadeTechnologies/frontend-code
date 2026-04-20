import { useState } from "react";

// StepButton component
const StepButton = ({
  label,
  target,
  onClick,
  stepIndex,
  setCurrentStep,
}: {
  label: string;
  target: string;
  onClick: () => void;
  stepIndex: number;
  setCurrentStep?: (step: number) => void;
}) => (
  <button
    className="text-left px-4 py-2 rounded hover:bg-primary-100 hover:text-[#3366CC] transition text-gray-700 font-medium w-full"
    onClick={() => {
      if (setCurrentStep) {
        setCurrentStep(stepIndex);
      } else {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      onClick();
    }}
    type="button">
    {label}
  </button>
);

// FloatingStepper component
const FloatingStepper = ({
  setCurrentStep,
}: {
  setCurrentStep?: (step: number) => void;
}) => {
  const [open, setOpen] = useState(false);

  const steps = [
    { label: "Trusts", target: "trusts", index: 0 },
    { label: "Trust Establishment", target: "trust-establishment", index: 1 },
    { label: "Project", target: "project", index: 2 },
    { label: "Conflict", target: "conflict", index: 3 },
    { label: "Community Satisfaction", target: "community-satisfaction", index: 4 },
    { label: "Economic Impact", target: "economic-impact", index: 5 },
  ];

  return (
    <div
      className={`fixed top-1/4 right-0 z-50 transition-all duration-300`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{
        transform: open ? "translateX(0)" : "translateX(80%)",
        width: open ? 220 : 40,
      }}>
      <div className="relative h-full">
        {/* Tab handle */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#3366CC] rounded-l-xl w-6 h-24 flex items-center justify-center cursor-pointer shadow"
          onClick={() => setOpen(!open)}>
          <span className="text-white font-bold rotate-90 select-none">
            {open ? "<" : ">"}
          </span>
        </div>
        {/* Stepper content */}
        <div
          className={`bg-white rounded-xl shadow-lg flex flex-col gap-4 p-4 border border-gray-200 ml-6 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
          {steps.map((step) => (
            <StepButton
              key={step.index}
              label={step.label}
              target={step.target}
              stepIndex={step.index}
              setCurrentStep={setCurrentStep}
              onClick={() => setOpen(false)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingStepper;
