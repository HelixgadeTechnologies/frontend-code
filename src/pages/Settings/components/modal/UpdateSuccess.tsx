import { userDeleteIcon } from "../../../../assets/icons";
import { observer } from "mobx-react-lite";
import Button from "../../../../components/elements/Button";

export const UpdateSuccess = observer(({
  close,
}: {
  close: () => void;
}) => {
  return (
    <div className="p-6 bg-white h-fit w-[430px] rounded-2xl">
      <div className=" border border-gray-300 bg-[#E4E5E77A]/40 mx-auto h-14 w-14 rounded-full flex items-center justify-center">
        <div className="shadow-md bg-white h-10 w-10 rounded-full flex items-center justify-center">
          <img src={userDeleteIcon} alt="delete" />
        </div>
      </div>

      <div className="mt-6 mb-12">
        <h3 className="text-lg xl:text-2xl text-center font-normal text-dark-2">
          Change Made Successfully
        </h3>

        <p className="mt-4 whitespace-normal normal-case text-base my-1 text-gray-6 text-center">
          The changes you made was successful.{" "}
          {/* <span className="font-medium">Are you sure about that? </span> */}
        </p>
      </div>

      <div className=" gap-x-8 flex items-center justify-center">
        <Button
          onClick={close}
          buttonText="Cancel"
          width="w-fit"
          type="button"
          padding="py-3 px-14"
        />
      </div>
    </div>
  );
});