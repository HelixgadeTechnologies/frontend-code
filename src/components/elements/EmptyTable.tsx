interface TableProps {
  headArr: string[];
  heading: string;
  text?: string;
  img?: string;
}

const EmptyTable = ({ headArr, heading, text, img }: TableProps) => {
  return (
    <div className={` px-4`}>
      <div
        className={` uppercase flex justify-between bg-primary-50  py-4 px-6 rounded-lg text-sm font-bold text-primary-500 `}
      >
        {headArr?.map((item, index) => (
          <li className="list-none" key={index}>
            {item}
          </li>
        ))}
      </div>
      <div className="mt-12 h-[50vh] text-center flex items-center justify-center border border-grey-500 rounded-lg">
        <div>
          {img && <img className="mx-auto" src={img} alt="No data available" />}
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
