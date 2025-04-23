import { useForm } from "react-hook-form";
import { Button, FormInput } from "../../../../components/elements";
import { toast } from "react-toastify";
import { CreateSettlorPayload, ISettingStore, ISettlorPayloadData } from "../../types/interface";
import { observer } from "mobx-react-lite";

export const AddSettlor = observer(({ close, settingStore }: { close: () => void, settingStore: ISettingStore }) => {

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const submit = async (data: any) => {
        try {
            const formData: ISettlorPayloadData = data
            const payload: CreateSettlorPayload = {
                isCreate: true,
                data: formData
            };
            // console.log("data", payload)
            const response = await settingStore.createSettlor(payload)
            if (response) {
                await settingStore.getAllSettlor()
                toast.success("Settlor registration successful.");
                close()
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
        <form
            onSubmit={handleSubmit(submit)}
            className="p-4 bg-off-white-3 h-fit w-[410px]"
        >
            <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
                Add Settlor
            </h3>

            <p className="text-base my-1 text-gray-6 text-center">
                Add a Settlor to this account{" "}
            </p>

            <div className="space-y-2">
                <div>
                    <FormInput
                        name="settlorName"
                        type="text"
                        placeholder="Enter Settlor Name"
                        register={register}
                        registerOptions={{
                            required: "Settlor name field is required.",
                        }}
                        error={errors.settlorName}
                        errorMessage={`"Settlor name field is required."`}
                        required
                    />
                </div>

                <div>
                    <FormInput
                        name="omlCode"
                        type="text"
                        placeholder="Enter OML Code"
                        register={register}
                        registerOptions={{
                            required: "OML code field is required.",
                        }}
                        error={errors.omlCode}
                        errorMessage={`OML code is required`}
                        required
                    />
                </div>

                <div>
                    <FormInput
                        name="contactName"
                        type="text"
                        placeholder="Enter Contact Name"
                        register={register}
                        registerOptions={{
                            required: "Contact name field is required.",
                        }}
                        error={errors.contactName}
                        errorMessage={`"Contact name field is required."`}
                        required
                    />
                </div>

                <div>
                    <FormInput
                        name="contactEmail"
                        type="email"
                        placeholder="Enter Contact Email"
                        register={register}
                        registerOptions={{
                            required: "Email field is required.",
                            pattern: {
                                value:
                                    /^[a-zA-Z0-9.!#$%&'+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/,
                                message: "Please enter a valid email.",
                            },
                        }}
                        error={errors.contactEmail}
                        errorMessage={`Email address is required`}
                        required
                    />
                </div>

                <div className="pb-4">
                    <FormInput
                        name="contactPhoneNumber"
                        type="tel"
                        placeholder="Enter Contact Phone Number"
                        register={register}
                        registerOptions={{
                            required: "Phone Number is required.",
                        }}
                        error={errors.contactPhoneNumber}
                        errorMessage={`Phone Number is required`}
                        required
                    />
                </div>

                <div className=" border-t border-gray-7 pt-4 flex items-center gap-x-8 lg:gap-x-16 justify-between">
                    <Button
                        onClick={close}
                        className="border text-black bg-white border-gray-7 rounded-lg py-2 px-7"
                        buttonText="Back"
                        width="w-fit"
                        type="button"
                    />

                    <Button
                        disabled={settingStore.isSubmitting}
                        padding="py-3"
                        buttonText={settingStore.isSubmitting ? "Adding.." : "Add"}
                    />
                </div>
            </div>
        </form>
    );
});