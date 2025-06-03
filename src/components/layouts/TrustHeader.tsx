import { bellIcon, userIcon } from "../../assets/icons";

const TrustHeader = () => {
  return (
    <header className="bg-white border-b border-gray-5 py-4 pl-4 pr-10 flex items-center justify-between">
      <h1 className="font-semibold  text-black text-lg lg:text-3xl">Trusts</h1>

      <div className="flex items-center  gap-x-7">
        <button className="relative">
          <img src={bellIcon} alt="notification" />
          {/* <span className="absolute top-0 -right-1 h-4 w-4 rounded-full flex items-center justify-center bg-primary-200 text-white text-[10px] font-semibold ">
            4
          </span> */}
        </button>

        <button className="h-9 w-9 rounded-full bg-primary-200/20 flex items-center justify-center">
          <img src={userIcon} alt="admin" />
        </button>
      </div>
    </header>
  );
};

export default TrustHeader;
