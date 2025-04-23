import { Controller, useForm } from "react-hook-form";
import { Button, CustomSelect, FormInput } from "../../../../components/elements";
import { createDraPayload, IDraPayloadData, IDropdownProp, IRole, ISettingStore } from "../../types/interface";
import { ITrustList, ITrustStore } from "../../../Trusts/types/interface";
import { toast } from "react-toastify";

export const AddDRA = ({ close, settingStore, trustStore }: { close: () => void, settingStore: ISettingStore, trustStore: ITrustStore }) => {
    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
    } = useForm();

    const submit = async (data: any) => {
        try {
            // const roleData = data.role as IDropdownProp
            const trustData = data.trust as IDropdownProp
            const formData: IDraPayloadData = {
                ...data,
                // roleId: roleData.value,
                trusts: trustData.value
            }
            const payload: createDraPayload = {
                isCreate: true,
                data: formData
            };
            // console.log("data", payload)
            const response = await settingStore.createDra(payload)
            if (response) {
                await settingStore.getAllDra()
                toast.success("DRA registration successful.");
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
                Add DRA
            </h3>

            <p className="text-base my-1 text-gray-6 text-center">Add DRA </p>

            <div className="space-y-2">
                <div>
                    <FormInput
                        label="First Name"
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
                        label="Last Name"
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
                        label="Email Address"
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

                <div>
                    <FormInput
                        label="Phone Number"
                        name="phoneNumber"
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

                {/* <div>
                    <Controller
                        control={control}
                        name="role"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <CustomSelect
                                id="role-select"
                                {...field}
                                options={[...settingStore.allRole.values()].map((v: IRole) => {
                                    return {
                                        label: v?.roleName,
                                        value: v?.roleId
                                    }
                                })}
                                isLoading={settingStore.isLoading}
                                label="Role"
                                placeholder="Role"
                            />
                        )}
                    />
                    {errors.role && (
                        <p className="mt-2 mb-4 text-xs  text-red-400 ">Select a Role</p>
                    )}
                </div> */}

                <div>
                    <Controller
                        control={control}
                        name="trust"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <CustomSelect
                                id="trust-select"
                                {...field}
                                options={[...trustStore.allTrust.values()].map((v: ITrustList) => {
                                    return {
                                        label: v?.trustName,
                                        value: v?.trustId
                                    }
                                })}
                                isLoading={trustStore.isLoading}
                                label="Trust"
                                isMulti={false}
                                placeholder="Assign Trust"
                            />
                        )}
                    />
                    {errors.trust && (
                        <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign a trust</p>
                    )}
                </div>

                <div className="pt-4 flex items-center gap-x-8 lg:gap-x-16 justify-between">
                    <Button
                        onClick={close}
                        className="border text-black bg-white border-gray-7 rounded-lg py-2 px-7"
                        buttonText="Back"
                        width="w-fit"
                        type="button"
                    />

                    <Button
                        padding="py-3"
                        buttonText={settingStore.isSubmitting ? "Inviting..." : "Invite"}
                    />
                </div>
            </div>
        </form>
    );
};