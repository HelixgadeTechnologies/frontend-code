import { useEffect } from "react";
import { Button, FormInput } from "../../../../components/elements";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CreateSettlorPayload, ISettingStore, ISettlor, ISettlorPayloadData } from "../../types/interface";
import { observer } from "mobx-react-lite";

export const EditSettlor = observer(({ close, settlor, settingStore }: { close: () => void, settlor: ISettlor, settingStore: ISettingStore }) => {

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    // Reset form when user changes
    useEffect(() => {
        // Only reset the form when both user and role data are available
        if (settlor) {
            reset({
                settlorName: settlor.settlorName || "",
                contactName: settlor.contactName || "",
                contactEmail: settlor.contactEmail || "",
                contactPhoneNumber: settlor?.contactPhoneNumber || "",
                omlCode: settlor?.omlCode || "",
            });
        }
    }, [settlor, reset]);

    const submit = async (data: any) => {
        try {
            const formData: ISettlorPayloadData = { ...data, settlorId: settlor.settlorId }
            const payload: CreateSettlorPayload = {
                isCreate: false,
                data: formData
            };
            // console.log("data", payload)
            const response = await settingStore.editSettlor(payload)
            if (response) {
                await settingStore.getAllSettlor();
                close()
                settingStore.isUpdated = true
            }
        } catch (error: any) {
            settingStore.isUpdated = false
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
                Edit Settlor
            </h3>

            <p className="text-base my-1 text-gray-6 text-center">
                Edit Settlor account{" "}
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
                        padding="py-3"
                        buttonText={settingStore.isSubmitting ? "Updating..." : "Update"}
                        disabled={settingStore.isSubmitting}
                    />
                </div>
            </div>
        </form>
    );
});