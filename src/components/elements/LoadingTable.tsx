interface TableProps {
  headArr: string[];
}

const LoadingTable = ({ headArr }: TableProps) => {
  return (
    <div className={` px-4`}>
      <div
        className={`overflow-x-scroll capitalize  flex justify-between bg-off-white-3  rounded-lg `}
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
      <div className="mt-4 h-[40vh] text-center flex items-center justify-center border border-gray-200 rounded">
        <div>
          <div className=" animate-pulse mx-auto border-2 border-grey-600 p-3 w-20 h-20 relative rounded-full flex justify-center items-center shadow-lg ">
            HCDT
          </div>

          <div className="mt-2">
            <h3 className="text-base lg:text-lg font-semibold text-grey-500">
              Please Wait!
            </h3>
            <p className=" italic mt-1 text-base lg:text-lg text-grey-500">
              Loading Data..
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingTable;
