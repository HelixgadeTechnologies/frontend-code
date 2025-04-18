type BackProps = {
  page?: string;
  trustName: string;
};

import { useNavigate } from "react-router-dom";

const GoBack = ({ trustName, page }: BackProps) => {
  const navigate = useNavigate();

  const moveback = () => {
    navigate(-1);
  };

  return (
    <section className="flex items-center gap-4">
      <button onClick={moveback} className=" flex items-center gap-x-2">
        <span className="w-fit bg-white flex items-center justify-center p-3 rounded-md border border-gray-200">
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.146446 3.35355C-0.0488155 3.15829 -0.0488155 2.84171 0.146446 2.64645L2.14645 0.646447C2.34171 0.451184 2.65829 0.451184 2.85355 0.646447C3.04882 0.841709 3.04882 1.15829 2.85355 1.35355L1.70711 2.5L9.5 2.5C9.77614 2.5 10 2.72386 10 3C10 3.27614 9.77614 3.5 9.5 3.5L1.70711 3.5L2.85355 4.64645C3.04882 4.84171 3.04882 5.15829 2.85355 5.35355C2.65829 5.54882 2.34171 5.54882 2.14645 5.35355L0.146446 3.35355Z"
              fill="black"
            />
          </svg>
        </span>

        <span className="text-sm font-medium">Go back</span>
      </button>

      <div className="capitalize text-[#98A2B3] text-sm font-bold flex items-center gap-x-1">
        Dashboard / {trustName}
        {page && " / "}
        <span className="text-primary-200"> {page}</span>
      </div>
    </section>
  );
};

export default GoBack;
