import { useForm } from "react-hook-form";
import { Button, FormInput } from "../../../../components/elements";
import { createNuprcPayload, INuprcPayloadData, ISettingStore } from "../../types/interface";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";

export const AddNuprc = observer(({ close, settingStore }: { close: () => void, settingStore: ISettingStore }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submit = async (data: any) => {
        try {
            const formData: INuprcPayloadData = data
            const payload: createNuprcPayload = {
                isCreate: true,
                data: formData
            };
            // console.log("data", payload)
            const response = await settingStore.createNuprc(payload)
            if (response) {
                await settingStore.getAllNUPRC()
                toast.success("NUPRC registration successful.");
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
            className="p-4 bg-off-white-3 h-fit w-[410px]">
            <h3 className="text-lg xl:text-3xl text-center font-normal text-dark-2">
                Add <span className="font-bold">NUPRC-ADR</span>
            </h3>

            <p className="text-base my-1 text-gray-6 text-center">Add NUPRC-ADR </p>

            <div className="space-y-2">
                <div>
                    <FormInput
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        register={register}
                        registerOptions={{
                            required: "First name field is required.",
                        }}
                        error={errors.firstName}
                        errorMessage={`First name  is required`}
                        required
                    />
                </div>

                <div>
                    <FormInput
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        register={register}
                        registerOptions={{
                            required: "Last name field is required.",
                        }}
                        error={errors.lastName}
                        errorMessage={`Last name  is required`}
                        required
                    />
                </div>

                <div>
                    <FormInput
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        register={register}
                        registerOptions={{
                            required: "Email field is required.",
                            pattern: {
                                value:
                                    /^[a-zA-Z0-9.!#$%&'+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/,
                                message: "Please enter a valid email.",
                            },
                        }}
                        error={errors.email}
                        errorMessage={`Email address is required`}
                        required
                    />
                </div>

                <div className="pb-4">
                    <FormInput
                        name="phoneNumber"
                        type="tel"
                        placeholder="Phone Number"
                        register={register}
                        registerOptions={{
                            required: "Phone Number is required.",
                        }}
                        error={errors.phoneNumber}
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

                    <Button padding="py-3" buttonText={settingStore.isSubmitting ? "Adding..." : "Add"} />
                </div>
            </div>
        </form>
    );
});