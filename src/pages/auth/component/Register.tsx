import React, { createContext, useCallback, useContext } from "react";
import { Button, CustomSelect, FormInput } from "../../../components/elements";
import { Controller, useForm } from "react-hook-form";
import { createDraPayload, IDraPayloadData, IDropdownProp } from "../../Settings/types/interface";
import { observer } from "mobx-react-lite";
import { trustStore as TrustStore } from "../../trust/store/trustStore";
import { ITrustList } from "../../trust/types/interface";
import { toast } from "react-toastify";
import { settingStore as SettingStore } from "../../Settings/store/settingStore";
import { authStore as AuthStore } from "../store/authStore";

const AuthStoreCTX = createContext(AuthStore)
const trustStoreCTX = createContext(TrustStore)
const settingStoreCTX = createContext(SettingStore)
const Register: React.FC = observer(() => {
    const authStore = useContext(AuthStoreCTX)
    const trustStore = useContext(trustStoreCTX)
    const settingStore = useContext(settingStoreCTX)
    // const [lg, setSetLg] = useState<Array<string>>([]);
    const { control, handleSubmit, register, formState: { errors }, } = useForm();

    // const selectState = useCallback((v: IDropdownProp) => {
    //     trustStore.allLGA.clear();
    //     let localGov = trustStore.getLG(String(v?.value));
    //     if (localGov.length > 0) {
    //         setSetLg(localGov);
    //     }
    //     trustStore.selectedState = String(v?.value);
    //     setValue("state", v); //set state field
    //     setValue("localGovernmentArea", null); // Reset LGA field
    // }, [trustStore]);

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
                authStore.pageSwitch = 1;
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

    const changeForm = useCallback((page: number) => {
        authStore.pageSwitch = page;
    }, [authStore]);
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <form onSubmit={handleSubmit(submit)} className="w-full max-w-md bg-white p-8 rounded">
                <h2 className="text-2xl font-semibold text-center mb-2 text-gray-900">Complete Account</h2>
                <p className="text-center text-gray-500 mb-6">
                    Enter your credentials to create your DRA account
                </p>

                <div className="mb-4">
                    <FormInput
                        label="First Name"
                        name="firstName"
                        type="text"
                        register={register}
                        registerOptions={{
                            required: "This field is required.",
                        }}
                        placeholder="First name"
                        error={errors.firstName}
                        errorMessage={`This field  is required`}
                        required
                    />
                </div>

                <div className="mb-4">
                    <FormInput
                        label="Last Name"
                        name="lastName"
                        type="text"
                        register={register}
                        registerOptions={{
                            required: "This field is required.",
                        }}
                        placeholder="Last name"
                        error={errors.lastName}
                        errorMessage={`This field  is required`}
                        required
                    />
                </div>

                <div className="mb-4">
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
                        placeholder="Email"
                    />
                </div>
                <div className="mb-4">
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

                {/* <div className="mb-4">
                    <Controller
                        control={control}
                        name="state"
                        // rules={{}}
                        render={({ field }) => (
                            <CustomSelect
                                id="state-select"
                                {...field}
                                // isLoading={trustLoading}
                                options={[...trustStore.allStates.values()].map((s: string) => {
                                    return {
                                        label: s,
                                        value: s
                                    }
                                })}
                                label="State"
                                isMulti={false}
                                placeholder="Select state"
                                onChange={(v) => selectState(v as IDropdownProp)}
                            />
                        )}
                    />
                    {errors.state && (
                        <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign a state</p>
                    )}
                </div> */}

                {/* <div className="mb-4">
                    <Controller
                        control={control}
                        name="localGovernmentArea"
                        // rules={{}}

                        render={({ field }) => (
                            <CustomSelect
                                id="lga-select"
                                {...field}
                                // isLoading={trustLoading}
                                options={lg.map((s: string) => {
                                    return {
                                        label: s,
                                        value: s
                                    }
                                })}
                                label="Local Government Area"
                                isMulti={false}
                                // isDisabled={true}
                                isDisabled={trustStore.selectedState ? false : true}
                                placeholder="Select"
                            />
                        )}
                    />
                    {errors.localGovernmentArea && (
                        <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign LG</p>
                    )}
                </div> */}

                <div className="mb-4">
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

                {/* <div className="mb-6">
                    <FormInput
                        label="Communities"
                        name="communities"
                        type="text"
                        register={register}
                        registerOptions={{
                            required: "This field is required.",
                        }}
                        placeholder="Enter communities"
                        error={errors.trustCommunities}
                        errorMessage={`This field  is required`}
                        required
                    />
                </div> */}
                <Button
                    padding="py-3"
                    buttonText={settingStore.isSubmitting ? "Creating..." : "Create Account"}
                    className="w-full bg-primary-200 text-white py-3 rounded font-semibold text-base hover:bg-primary-300 transition"
                />
                <span className="block text-center mt-6 text-gray-2 text-sm">
                    {" "} If you already have an account {" "}
                    <button className="text-primary-200 font-semibold" onClick={() => changeForm(1)}>
                        Log in
                    </button>
                </span>
            </form>
        </div>
    );
});

export default Register;