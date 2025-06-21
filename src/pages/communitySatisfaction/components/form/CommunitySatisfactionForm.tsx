import { useForm } from "react-hook-form";
import CustomRadio from "../../../../components/elements/CustomRadio";
import { ISatisfactionPayload, ISatisfactionPayloadData, ISatisfactionStore } from "../../types/interface";
import { useParams } from "react-router-dom";
import { Button, GoBack } from "../../../../components/elements";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { ITrustStore } from "../../../trust/types/interface";
import { useCallback } from "react";
type Props = {
    satisfactionStore: ISatisfactionStore; // Replace with actual type if available
    trustStore: ITrustStore;
}
const CommunitySatisfactionForm = observer((props: Props) => {
    const { name } = useParams();
    const { control, handleSubmit, reset } = useForm();
    // const { isAddFunctionalityNeeded } = props.satisfactionStore;
    const closeAddForm = useCallback(() => {
        props.satisfactionStore.isAddFunctionalityNeeded = false;
    }, [props.satisfactionStore]);


    const submit = async (data: any) => {
        try {
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
                trustId: String(props.trustStore.selectedTrustId),

            };
            const payload: ISatisfactionPayload = {
                isCreate: true,
                data: satisfactionData
            }
            // console.log("Satisfaction payload:", payload);
            const response = await props.satisfactionStore.createSatisfaction(payload)
            if (response) {
                toast.success("Community Satisfaction Successfully Submitted");
                reset({});
                // props.satisfactionStore.isAddFunctionalityNeeded = false;
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
        <div className="p-6 bg-gray-100">
            <GoBack action={closeAddForm} trustName={name || ""} page="Average Community Satisfaction" />
            {/* Section 1: Trust Establishment Status */}

            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Average Community Satisfaction
            </h1>
            <p className="text-sm text-gray-600 mb-6">
                These are your personal details, they are visible to the public
            </p>

            <form onSubmit={handleSubmit(submit)}>
                <div className="bg-white rounded-lg p-6 ">
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

                        {/* Question 2 */}
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

                        {/* Question 3 */}
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

                        {/* Question 4 */}
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

                        {/* Question 4 */}
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
                        {/* Question 5*/}
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
                        {/* Question 6 */}
                      
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-8 mb-4">
                    Existence, and activeness of sustainability management structure/committees established by the Trust
                </h1>
                <p className="text-sm text-gray-600 mb-6">
                    These are your personal details, they are visible to the public
                </p>
                <div className="bg-white rounded-lg p-6 ">
                    <div className="space-y-6">
                        {/* Question 5 */}
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


                        {/* Question 6 */}
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

                        {/* Question 7 */}
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
                <div className="mt-8 flex flex-col lg:flex-row items-center gap-8 justify-between">
                    <Button
                        onClick={reset}
                        className="border text-black bg-white border-blue-7 rounded-lg py-2 px-4 lg:px-10"
                        buttonText="Reset"
                        width="w-fit"
                        type="reset"
                    />

                    <Button padding="py-3" buttonText={props.satisfactionStore.isSubmitting ? "Submitting..." : "Submit"} />
                </div>
            </form>
        </div >
    );
});

export default CommunitySatisfactionForm;