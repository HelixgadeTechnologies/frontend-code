import { toast } from "react-toastify";
import { trustIcon } from "../../../../assets/icons";
import { Button } from "../../../../components/elements";
import { observer } from "mobx-react-lite";
import { ITrustEstablishmentStore } from "../../types/interface";

export const DeleteFile = observer(({
  close,
  store,
  type,
  url
}: {
  close: () => void;
  store: ITrustEstablishmentStore;
  type: string;
  url: string
}) => {
  const handleRemove = async () => {
    try {
      if (type == "CAC") {
        await store.destroyCACDocument(url, store.trustEstablishmentStatus?.trustEstablishmentStatusId!)
        toast.success("CACDocument successfully removed");
        close();
      } else {
        await store.destroyMatrixDocument(url, store.trustEstablishmentStatus?.trustEstablishmentStatusId!)
        toast.success("MatrixDocument successfully removed");
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
          Delete {type} Document
        </h3>

        <p className="mt-4 whitespace-normal normal-case text-base my-1 text-gray-6 text-center">
          You are about to delete the {type} Document.{" "}
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
          onClick={handleRemove}
          width="w-fit"
          padding="py-3 px-14"
          buttonText={store.isDeleting ? "Removing.." : "Remove"}
        />
      </div>
    </div>
  );
});