import { toast } from "react-toastify";
import { userDeleteIcon } from "../../../../assets/icons";
import { Button } from "../../../../components/elements";
import { ISettingStore } from "../../types/interface";
import { observer } from "mobx-react-lite";

export const DeleteNuprc = observer(({ close, userId, store }: { close: () => void, store: ISettingStore, userId: string }) => {

    const handleRemoveNUPRC = async () => {
        try {
            const response = await store.removeNuprc(userId)
            if (response) {
                toast.success("NUPRC successfully removed");
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
                    <img src={userDeleteIcon} alt="delete" />
                </div>
            </div>

            <div className="mt-6 mb-12">
                <h3 className="text-lg xl:text-2xl text-center font-normal text-dark-2">
                    Delete NUPRC-ADR
                </h3>

                <p className="mt-4 whitespace-normal normal-case text-base my-1 text-gray-6 text-center">
                    You are about to delete a NUPRC-ADR{" "}
                    <span className="font-medium">Are you sure about that? </span>
                </p>
            </div>

            <div className=" gap-x-8 flex items-center justify-center">
                <Button
                    onClick={close}
                    className="underline font-medium text-dark-2"
                    buttonText="Cancel"
                    width="w-fit"
                />

                <Button
                    width="w-fit"
                    padding="py-3 px-14"
                    onClick={handleRemoveNUPRC}
                    buttonText={store.isDeleting ? "Removing.." : "Remove"}
                />
            </div>
        </div>
    );
});