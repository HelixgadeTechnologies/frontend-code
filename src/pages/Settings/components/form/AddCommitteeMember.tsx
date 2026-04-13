import { Controller, useForm } from "react-hook-form";
import { Button, CustomSelect, FormInput } from "../../../../components/elements";
import {IDropdownProp, ISettingStore } from "../../types/interface";
import { ITrustList, ITrustStore } from "../../../trust/types/interface";
import { toast } from "react-toastify";
import { toJS } from "mobx";

interface AddCommitteeMemberProps {
    roleName: string;
    close: () => void;
    settingStore: ISettingStore;
    trustStore: ITrustStore;
}

export const AddCommitteeMember = ({ roleName, close, settingStore, trustStore }: AddCommitteeMemberProps) => {
    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
    } = useForm();

    const submit = async (data: any) => {
        try {


            // Find roleId for the given roleName
            const role = [...settingStore.allRole.values()].find(r => r.roleName === roleName);
            console.log(toJS(role))
            const trustData = data.trust as IDropdownProp;

            const formData = {
                ...data,
                roleId: role ? role.roleId : "",
                trustId: trustData.value
            }
            const payload: any = {
                isCreate: true,
                data: formData
            };

            const response = await settingStore.registerAllUser(payload)
            if (response) {
                if (roleName === "Data Reporting Agent (DRA)") await settingStore.getAllDra();
                else if (roleName === "Board of Trustee (BoT)") await settingStore.getAllBoT();
                else if (roleName === "Management Committee (MC)") await settingStore.getAllMC();
                else if (roleName === "Advisory Committee (AC)") await settingStore.getAllAC();
                toast.success(`${roleName} registration successful.`);
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
                Add {roleName}
            </h3>

            <p className="text-base my-1 text-gray-6 text-center">Add {roleName} </p>

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
