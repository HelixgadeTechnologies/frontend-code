import { observer } from "mobx-react-lite";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { trustStore as TrustStore } from "../trust/store/trustStore";
import IMG from "../../assets/icons/access2.svg"
import IMG2 from "../../assets/icons/notfound.svg"
import IMG3 from "../../assets/icons/thanks.svg"
import { economicImpactStore as EconomicImpactStore } from "../EconomicImpact/store/economicImpactStore";
import { IEconomicImpactPayload, IEconomicImpactPayloadData } from "../EconomicImpact/types/interface";
import { Button, CustomRadio } from "../../components/elements";

const trustStoreCTX = createContext(TrustStore);
const economicImpactStoreCTX = createContext(EconomicImpactStore);
const EconomicImpactDataForm = observer(() => {
    const trustStore = useContext(trustStoreCTX);
    const economicImpactStore = useContext(economicImpactStoreCTX);
    const { register, control, handleSubmit, reset } = useForm();
    const { trustId } = useParams(); // if your route is /page/:id
    const [submitted, setSubmitted] = useState(false);
    useEffect(() => {
        async function fetchData() {
            // console.log("Fetching data for trustId:", trustId);
            if (trustId) {
                await trustStore.getATrust(trustId as string);
            }
        }
        fetchData();
    }, [trustStore]);

    const onSubmit = async (data: any) => {
        try {
            // console.log("Form Data:", data);

            const economicImpactData: IEconomicImpactPayloadData = {
                businessGrowth: Number(data.businessGrowth),
                incomeIncrease: Number(data.incomeIncrease),
                livelihoodImprove: Number(data.livelihoodImprove),
                accessAmenities: Number(data.accessAmenities),
                trustId: trustId ? trustId : "",
            };
            const payload: IEconomicImpactPayload = {
                isCreate: true,
                data: economicImpactData
            }
            const response = await economicImpactStore.createEconomicImpact(payload)
            if (response) {
                reset()
                setSubmitted(true);
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
        <>
            {!submitted && (
                <>
                    {trustStore.trust?.disableEconomicImpactSurvey == 1 && (
                        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                            <div >
                                <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
                                    Economic Impact of HCDT in Host Communities
                                </h2>
                                <p className="text-center text-gray-600 mb-10 text-lg">
                                    Help us understand and resolve issues better. Please fill out the details below.
                                </p>

                                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto px-2 sm:px-4 bg-white rounded-lg p-4 sm:p-6">
                                    <div className="mb-6 ">
                                        <div className="mb-4">
                                            <CustomRadio
                                                name="businessGrowth"
                                                control={control}
                                                rules={{ required: "This field is required" }}
                                                label="i. My business is generating more money since they implemented some of the HCDT projects in my community."
                                                options={[
                                                    { value: "1", label: "Very True" },
                                                    { value: "2", label: "Slightly" },
                                                    { value: "3", label: "Not True" },
                                                ]}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <CustomRadio
                                                name="incomeIncrease"
                                                control={control}
                                                rules={{ required: "This field is required" }}
                                                label="ii. My income has increased since the implementation of some of the HCDT projects in my community."
                                                options={[
                                                    { value: "1", label: "Very True" },
                                                    { value: "2", label: "Slightly" },
                                                    { value: "3", label: "Not True" },
                                                ]}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <CustomRadio
                                                name="livelihoodImprove"
                                                control={control}
                                                rules={{ required: "This field is required" }}
                                                label="iii. The implemented HCDT projects have bettered my livelihood and quality of lives."
                                                options={[
                                                    { value: "1", label: "Very True" },
                                                    { value: "2", label: "Slightly" },
                                                    { value: "3", label: "Not True" },
                                                ]}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                iv. As a result of the HCDT projects, my household/I now have access to these basic amenities than before.
                                            </label>
                                            <div className="space-y-2">
                                                {/* Row 1 */}
                                                <div className="flex flex-wrap gap-6">
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                        <input
                                                            {...register("accessAmenities", { required: "This field is required" })}
                                                            type="radio" name="accessAmenities" value="1" className="accent-blue-600" />
                                                        Healthcare
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                        <input
                                                            {...register("accessAmenities", { required: "This field is required" })}
                                                            type="radio" name="accessAmenities" value="2" className="accent-blue-600" />
                                                        Education
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                        <input
                                                            {...register("accessAmenities", { required: "This field is required" })}
                                                            type="radio" name="accessAmenities" value="3" className="accent-blue-600" />
                                                        Portable Water
                                                    </label>
                                                </div>
                                                {/* Row 2 */}
                                                <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-700">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            {...register("accessAmenities", { required: "This field is required" })}
                                                            type="radio" name="accessAmenities" value="4" className="accent-blue-600" />
                                                        Electricity
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                        <input
                                                            {...register("accessAmenities", { required: "This field is required" })}
                                                            type="radio" name="accessAmenities" value="5" className="accent-blue-600" />
                                                        Good Roads
                                                    </label>
                                                </div>
                                                {/* Row 3 */}
                                                <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-700">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            {...register("accessAmenities", { required: "This field is required" })}
                                                            type="radio" name="accessAmenities" value="6" className="accent-blue-600" />
                                                        Market
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                        <input
                                                            {...register("accessAmenities", { required: "This field is required" })}
                                                            type="radio" name="accessAmenities" value="7" className="accent-blue-600" />
                                                        Favourable Business Environment
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 justify-between">
                                        <Button
                                            onClick={close}
                                            className="border text-black bg-white border-blue-7 rounded-lg py-2 px-4 sm:px-10"
                                            buttonText="Cancel"
                                            width="w-fit"
                                        />
                                        <Button
                                            padding="py-3"
                                            buttonText={economicImpactStore.isSubmitting ? "Submitting..." : "Submit"}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>

                    )}
                    {/* Access Denied Section */}
                    {trustStore.trust?.disableEconomicImpactSurvey == 0 && (
                        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                            <div>
                                <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
                                    Economic Impact of HCDT in Host Communities
                                </h2>
                                <p className="text-center text-gray-600 mb-10 text-lg">
                                    Help us understand and resolve issues better. Please contact the administrator for access.
                                </p>
                                <div className="flex items-center justify-center w-full h-80">
                                    <img
                                        src={IMG}
                                        className="object-contain h-full max-h-80 w-auto"
                                        alt="Centered"
                                    />
                                </div>
                                <h3 className="text-3xl font-bold text-center">Access denied</h3>
                            </div>
                        </div>
                    )}
                    {/* NotFound*/}
                    {trustStore.trust == null && (
                        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                            <div>
                                <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
                                    Economic Impact of HCDT in Host Communities
                                </h2>
                                <p className="text-center text-gray-600 mb-10 text-lg">
                                    Help us understand and resolve issues better. Please contact the administrator for access.
                                </p>
                                <div className="flex items-center justify-center w-full h-80">
                                    <img
                                        src={IMG2}
                                        className="object-contain h-full max-h-80 w-auto"
                                        alt="Centered"
                                    />
                                </div>
                                <h3 className="text-3xl font-bold text-center">Invalid Trust ID</h3>
                            </div>
                        </div>
                    )}
                </>
            )}
            {submitted && (
                <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-blue-800 mb-4"> Economic Impact of HCDT in Host Communities Data Submitted Successfully</h2>
                        <p className="text-gray-600 mb-6">Thank you for your submission. Your conflict data has been recorded.</p>
                        <div className="flex items-center justify-center w-full h-80">
                            <img
                                src={IMG3}
                                className="object-contain h-full max-h-80 w-auto"
                                alt="Centered"
                            />
                        </div>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-6"
                        >
                            Submit Another Report
                        </button>
                    </div>
                </div>
            )}


        </>
    );
});

export default EconomicImpactDataForm;