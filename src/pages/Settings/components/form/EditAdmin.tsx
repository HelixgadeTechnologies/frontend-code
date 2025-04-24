import { Controller, useForm } from "react-hook-form";
import { Button, CustomSelect, FormInput } from "../../../../components/elements";
import { toast } from "react-toastify";
import { CreateAdminPayload, IAdmin, IAdminPayloadData, IDropdownProp, IRole, ISettingStore } from "../../types/interface";

import { observer } from "mobx-react-lite";
import { ITrustList, ITrustStore } from "../../../trust/types/interface";
import { useEffect } from "react";

export const EditAdmin = observer(({ close, user, settingStore, trustStore }: { close: () => void; user: IAdmin, settingStore: ISettingStore, trustStore: ITrustStore }) => {
    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
        reset,
    } = useForm();

    useEffect(() => {
        async function loadRequests() {
            await settingStore.getRole();
            await trustStore.getAllTrust();
            if (user) {
                const role = settingStore.allRole.get(user.roleId as string);
                const trust = trustStore.allTrust.get(user.trusts as string);
                reset({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    email: user.email || "",
                    role: {
                        label: role?.roleName,
                        value: role?.roleId
                    } as IDropdownProp,
                    trust: {
                        label: trust?.trustName,
                        value: trust?.trustId
                    } as IDropdownProp,
                });
            }
        }
        loadRequests();

    }, [user, reset]);
    const submit = async (data: any) => {
        try {
            const roleData = data.role as IDropdownProp
            const trustData = data.trust as IDropdownProp
            const formData: IAdminPayloadData = {
                ...data,
                roleId: roleData.value,
                trusts: trustData.value,
                userId: user.userId,
                status: user.status,
                phoneNumber: user.phoneNumber,
            }
            const payload: CreateAdminPayload = {
                isCreate: false,
                data: formData
            };
            const response = await settingStore.editAdmin(payload)

            if (response) {
                await settingStore.getAllAdmin();
                close()
                settingStore.isUpdated = true;
            }
        } catch (error: any) {
            settingStore.isUpdated = false;
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
                Edit Admin
            </h3>

            <p className="text-base my-1 text-gray-6 text-center">
                Make edits to this admin account
            </p>

            <div className="space-y-2">
                <div>
                    <FormInput
                        label="First Name"
                        name="firstName"
                        type="text"
                        register={register}
                        registerOptions={{
                            required: "First name field is required.",
                        }}
                        error={errors.firstName}
                        errorMessage={`First name is required`}
                        required
                    />
                </div>

                <div>
                    <FormInput
                        label="Last Name"
                        name="lastName"
                        type="text"
                        register={register}
                        registerOptions={{
                            required: "Last name field is required.",
                        }}
                        error={errors.lastName}
                        errorMessage={`Last name is required`}
                        required
                    />
                </div>

                <div>
                    <FormInput
                        label="Email Address"
                        name="email"
                        type="email"
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
                    {errors.roleId && (
                        <p className="mt-2 mb-4 text-xs text-red-400">Select a Role</p>
                    )}
                </div>

                <div>
                    <Controller
                        control={control}
                        name="trust"
                        rules={{}}
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
                                placeholder="Assign Trust"
                            />
                        )}
                    />
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
                        buttonText={settingStore.isSubmitting ? "Updating..." : "Update"}
                    />
                </div>
            </div>
        </form>
    );
});