import { JSX } from "react";

interface TableProps {
  headArr: string[];
  heading: string;
  text?: string | JSX.Element;
  img?: string;
}

const EmptyTable = ({ headArr, heading, text, img }: TableProps) => {
  return (
    <div className={` px-4`}>
      <div
        className={` overflow-x-scroll capitalize  flex justify-between bg-off-white-3  rounded-lg `}
      >
        {headArr?.map((item, index) => (
          <li
            className="list-none  capitalize whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-gray-9"
            key={index}
          >
            {item}
          </li>
        ))}
      </div>
      <div className="mt-8 h-[40vh] text-center flex items-center justify-center border border-grey-500 rounded-lg">
        <div>
          {img && <img className="mx-auto" src={img} alt="No data available" style={{width:"200px"}} />}
          <div className="mt-2">
            <h3 className="text-base lg:text-lg font-semibold text-grey-500">
              {heading}
            </h3>
            <p className=" italic mt-1 text-base lg:text-lg text-grey-500">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyTable;
