import { toast } from "react-toastify";
import { trustIcon } from "../../../../assets/icons";
import { Button } from "../../../../components/elements";
import { ITrustStore } from "../../types/interface";
import { observer } from "mobx-react-lite";

export const DeleteTrust = observer(({
  close,
  trustId,
  store
}: {
  close: () => void;
  trustId: string;
  store: ITrustStore
}) => {
  const handleRemoveTrust = async () => {
    try {
      const response = await store.removeTrust(trustId)
      if (response) {
        toast.success("Trust successfully removed");
        close();
      }
    } catch (error: any) {
      const message = error?.response?.body?.message;
      const message2 = error?.response?.body?.error;
      if (message?.includes("Please try again. Database connection failed.")) {
        toast.info(message);
      } else {
        toast.error(message2);
      }
    }
  };

  return (
    <div className="p-6 bg-white h-fit w-[430px] rounded-2xl">
      <div className=" border border-gray-300 bg-[#E4E5E77A]/40 mx-auto h-14 w-14 rounded-full flex items-center justify-center">
        <div className="shadow-md bg-white h-10 w-10 rounded-full flex items-center justify-center">
          <img src={trustIcon} alt="delete" />
        </div>
      </div>

      <div className="mt-6 mb-12">
        <h3 className="text-lg xl:text-2xl text-center font-normal text-dark-2">
          Delete Trust
        </h3>

        <p className="mt-4 whitespace-normal normal-case text-base my-1 text-gray-6 text-center">
          You are about to delete the trust.{" "}
          <span className="font-medium">Are you sure about that? </span>
        </p>
      </div>

      <div className=" gap-x-8 flex items-center justify-center">
        <Button
          onClick={close}
          className="underline font-medium text-dark-2"
          buttonText="Cancel"
          width="w-fit"
          type="button"
        />

        <Button
          onClick={handleRemoveTrust}
          width="w-fit"
          padding="py-3 px-14"
          buttonText={store.isDeleting ? "Removing.." : "Remove"}
        />
      </div>
    </div>
  );
});