import { observer } from "mobx-react-lite";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { trustStore as TrustStore } from "../trust/store/trustStore";
import IMG from "../../assets/icons/access2.svg"
import IMG2 from "../../assets/icons/notfound.svg"
import IMG3 from "../../assets/icons/thanks.svg"
import { Button, CustomRadio } from "../../components/elements";
import { satisfactionStore as SatisfactionStore } from "../communitySatisfaction/store/satisfactionStore";
import { ISatisfactionPayload, ISatisfactionPayloadData } from "../communitySatisfaction/types/interface";

const satisfactionStoreCTX = createContext(SatisfactionStore);
const trustStoreCTX = createContext(TrustStore);
const SatisfactionDataForm = observer(() => {
    const satisfactionStore = useContext(satisfactionStoreCTX);
    const trustStore = useContext(trustStoreCTX);
    const { control, handleSubmit, reset } = useForm();
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

            // console.log("Form Data:", data);
            const satisfactionData: ISatisfactionPayloadData = {
                infoProjects: Number(data.infoProjects),
                communityConsult: Number(data.communityConsult),
                localParticipation: Number(data.localParticipation),
                reportMechanism: Number(data.reportMechanism),
                conflictMinimization: Number(data.conflictMinimization),
                settlorAction: Number(data.settlorAction),
                nuprcAction: Number(data.nuprcAction),

                projectHandover: Number(data.projectHandover),
                maintenanceConsult: Number(data.maintenanceConsult),
                incomeProject: Number(data.incomeProject),
                trustId: trustId ? trustId : "",

            };
            const payload: ISatisfactionPayload = {
                isCreate: true,
                data: satisfactionData
            }
            // console.log("Satisfaction payload:", payload);
            const response = await satisfactionStore.createSatisfaction(payload)
            if (response) {
                // toast.success("Community Satisfaction Successfully Submitted");
                reset();
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
                    {trustStore.trust?.disableSatisfactionSurvey == 1 && (
                        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                            <div >
                                <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
                                    Average Community Satisfaction Data Reporting
                                </h2>
                                <p className="text-center text-gray-600 mb-10 text-lg">
                                    Help us understand better. Please fill out the details below.
                                </p>

                                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto px-2 sm:px-4">
                                    <div className="bg-white rounded-lg p-4 sm:p-6">
                                        <div className="space-y-6">
                                            {/* Question 1 */}
                                            <CustomRadio
                                                name="infoProjects"
                                                control={control}
                                                label="(i). We feel well-informed about the implemented projects by the Trust governing structures."
                                                options={[
                                                    { value: "1", label: "Strongly Disagree" },
                                                    { value: "2", label: "Disagree" },
                                                    { value: "3", label: "Slightly Agree" },
                                                    { value: "4", label: "Agree" },
                                                    { value: "5", label: "Strongly Agree" },
                                                ]}
                                            />
                                            {/* ...other CustomRadio questions... */}
                                            <CustomRadio
                                                name="communityConsult"
                                                control={control}
                                                label="(ii). We feel the community has been sufficiently consulted about the implemented projects by the Trust governing structure (e.g Has your community been consulted by either BoT or any contractor about involvement in project delivery in your community)."
                                                options={[
                                                    { value: "1", label: "Strongly Disagree" },
                                                    { value: "2", label: "Disagree" },
                                                    { value: "3", label: "Slightly Agree" },
                                                    { value: "4", label: "Agree" },
                                                    { value: "5", label: "Strongly Agree" },
                                                ]}
                                            />
                                            <CustomRadio
                                                name="localParticipation"
                                                control={control}
                                                label="(iii). We feel sufficient opportunities have been given to local community members to participate in the HCDT projects implemented by the government structures and the participant are treated well?"
                                                options={[
                                                    { value: "1", label: "Strongly Disagree" },
                                                    { value: "2", label: "Disagree" },
                                                    { value: "3", label: "Slightly Agree" },
                                                    { value: "4", label: "Agree" },
                                                    { value: "5", label: "Strongly Agree" },
                                                ]}
                                            />
                                            <CustomRadio
                                                name="reportMechanism"
                                                control={control}
                                                label="(iv). There is a clear mechanism to report concerns to the governing structures and community complaints/concerns are efficiently addressed by the governing structures (BoT, Management)."
                                                options={[
                                                    { value: "1", label: "Strongly Disagree" },
                                                    { value: "2", label: "Disagree" },
                                                    { value: "3", label: "Slightly Agree" },
                                                    { value: "4", label: "Agree" },
                                                    { value: "5", label: "Strongly Agree" },
                                                ]}
                                            />
                                            <CustomRadio
                                                name="conflictMinimization"
                                                control={control}
                                                label="(v). The way the governing structures (BoT, Mc & AC) have acted has minimized the potential for conflict in my community."
                                                options={[
                                                    { value: "1", label: "Strongly Disagree" },
                                                    { value: "2", label: "Disagree" },
                                                    { value: "3", label: "Slightly Agree" },
                                                    { value: "4", label: "Agree" },
                                                    { value: "5", label: "Strongly Agree" },
                                                ]}
                                            />
                                            <CustomRadio
                                                name="settlorAction"
                                                control={control}
                                                label="The way the Settlor has acted has  minimized conflict and improved their relationship with the host communities."
                                                options={[
                                                    { value: "1", label: "Strongly Disagree" },
                                                    { value: "2", label: "Disagree" },
                                                    { value: "3", label: "Slightly Agree" },
                                                    { value: "4", label: "Agree" },
                                                    { value: "5", label: "Strongly Agree" },
                                                ]}
                                            />
                                            <CustomRadio
                                                name="nuprcAction"
                                                control={control}
                                                label="The way NUPRC is regulating and responding is effectively addressing disputes emanating from the implementation of the HCDT, and promoting improved relationships between host communities and Settlor's."
                                                options={[
                                                    { value: "1", label: "Strongly Disagree" },
                                                    { value: "2", label: "Disagree" },
                                                    { value: "3", label: "Slightly Agree" },
                                                    { value: "4", label: "Agree" },
                                                    { value: "5", label: "Strongly Agree" },
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 2: Sustainability Management Structures */}
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-8 mb-4 px-2 sm:px-0">
                                        Existence, and activeness of sustainability management structure/committees established by the Trust
                                    </h1>
                                    <div className="bg-white rounded-lg p-4 sm:p-6">
                                        <div className="space-y-6">
                                            <CustomRadio
                                                name="projectHandover"
                                                control={control}
                                                label="(i). The Trust commissioned and handed over completed projects in our community to the community leadership?"
                                                options={[
                                                    { value: "3", label: "True" },
                                                    { value: "2", label: "It Improves" },
                                                    { value: "1", label: "Not True" },
                                                    { value: "4", label: "Project yet to be implemented in my community" },
                                                ]}
                                            />
                                            <CustomRadio
                                                name="maintenanceConsult"
                                                control={control}
                                                label="(ii). The Trust has consulted our community leadership to discuss or develop  maintenance plans for all the completed projects implemented in our community."
                                                options={[
                                                    { value: "3", label: "True" },
                                                    { value: "2", label: "It Improves" },
                                                    { value: "1", label: "Not True" },
                                                    { value: "4", label: "Project yet to be implemented in my community" },
                                                ]}
                                            />
                                            <CustomRadio
                                                name="incomeProject"
                                                control={control}
                                                label="(iii). The Trust implemented or is implementing  at least one income generating project for the host communities"
                                                options={[
                                                    { value: "3", label: "True" },
                                                    { value: "2", label: "It Improves" },
                                                    { value: "1", label: "Not True" },
                                                    { value: "4", label: "Project yet to be implemented in my community" },
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 justify-between">
                                        <Button
                                            onClick={reset}
                                            className="border text-black bg-white border-blue-7 rounded-lg py-2 px-4 sm:px-10"
                                            buttonText="Reset"
                                            width="w-fit"
                                            type="reset"
                                        />
                                        <Button
                                            padding="py-3"
                                            buttonText={satisfactionStore.isSubmitting ? "Submitting..." : "Submit"}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>

                    )}
                    {/* Access Denied Section */}
                    {trustStore.trust?.disableSatisfactionSurvey == 0 && (
                        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                            <div>
                                <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
                                    Average Community Satisfaction Data Reporting
                                </h2>
                                <p className="text-center text-gray-600 mb-10 text-lg">
                                    Help us understand better. Please contact the administrator for access.
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
                                    Average Community Satisfaction Data Reporting
                                </h2>
                                <p className="text-center text-gray-600 mb-10 text-lg">
                                    Help us understand better. Please contact the administrator for access.
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
                        <h2 className="text-3xl font-bold text-blue-800 mb-4"> Average Community Satisfaction Data Submitted Successfully</h2>
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

export default SatisfactionDataForm;