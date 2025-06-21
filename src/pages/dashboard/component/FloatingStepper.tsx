import { useState } from "react";

// StepButton component
const StepButton = ({ label, target, onClick }: { label: string; target: string; onClick: () => void }) => (
  <button
    className="text-left px-4 py-2 rounded hover:bg-primary-100 transition text-gray-700 font-medium w-full"
    onClick={() => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      onClick();
    }}
    type="button"
  >
    {label}
  </button>
);

// FloatingStepper component
const FloatingStepper = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`fixed top-1/4 right-0 z-50 transition-all duration-300`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{
        transform: open ? "translateX(0)" : "translateX(80%)",
        width: open ? 220 : 40,
      }}
    >
      <div className="relative h-full">
        {/* Tab handle */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary-200 rounded-l-xl w-6 h-24 flex items-center justify-center cursor-pointer shadow"
          onClick={() => setOpen(!open)}
        >
          <span className="text-white font-bold rotate-90 select-none">{open ? "<" : ">"}</span>
        </div>
        {/* Stepper content */}
        <div className={`bg-white rounded-xl shadow-lg flex flex-col gap-4 p-4 border border-gray-200 ml-6 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <StepButton label="Trust Establishment" target="trust-establishment" onClick={() => setOpen(false)} />
          <StepButton label="Project" target="project" onClick={() => setOpen(false)} />
          <StepButton label="Conflict" target="conflict" onClick={() => setOpen(false)} />
          <StepButton label="Community Satisfaction" target="community-satisfaction" onClick={() => setOpen(false)} />
          <StepButton label="Economic Impact" target="economic-impact" onClick={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default FloatingStepper;