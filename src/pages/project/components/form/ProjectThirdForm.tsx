import { FormInput, Button } from "../../../../components/elements";
import { observer } from "mobx-react-lite";
import { projectStore as ProjectStore } from "../../store/projectStore";
import { createContext, useContext } from "react";
import { IProjectPayloadData } from "../../types/interface";
import { trustStore as TrustStore } from "../../../trust/store/trustStore"

const projectStoreCTX = createContext(ProjectStore)
const trustStoreCTX = createContext(TrustStore)
const ProjectThirdForm = observer(({ method}: { method: any}) => {
    const projectStore = useContext(projectStoreCTX)
    const trustStore = useContext(trustStoreCTX)
    const { register, handleSubmit, formState: { errors } } = method;
  
    const onSubmit = (data: any) => {
        // console.log("Form Data:", data);
        projectStore.isSaving = true

        const projectFormData: IProjectPayloadData = {
            ...projectStore.projectFormData,
            numberOfHostCommunityMemberContracted: Number(data.numberOfHostCommunityMemberContracted),
            numberOfMaleBenefited: Number(data.numberOfMaleBenefited),
            numberOfFemaleBenefited: Number(data.numberOfFemaleBenefited),
            numberOfPwDsBenefited: Number(data.numberOfPwDsBenefited),
            trustId: trustStore.selectedTrustId
        }
      

        //save to store
        projectStore.projectFormData = projectFormData
        projectStore.isSaving = false
        //move to the next form
        projectStore.setCompletedTab();
    };

    return (
        <div>
            <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 ">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold text-gray-800">Project</h1>
                    <p className="text-sm text-gray-600">Fill out these details</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Number of Host Community Members */}
                    <FormInput
                        label="Number of host community members contracted to deliver goods/materials and services by the contractor."
                        name="numberOfHostCommunityMemberContracted"
                        type="number"
                        placeholder="Enter approved budget"
                        register={register}
                        registerOptions={{ required: "This field is required." }}
                        error={errors.hostCommunityMembers}
                    />

                    {/* Number of Community Members Benefited */}
                    <p className="text-sm text-gray-600">Number of community members that benefited from the livelihood/human capital development programs.</p>

                    {/* Total Number of Females Benefited */}
                    <FormInput
                        label="Total number of females that benefited from the initiative."
                        name="numberOfFemaleBenefited"
                        type="number"
                        placeholder="Enter number"
                        register={register}
                        registerOptions={{ required: "This field is required." }}
                        error={errors.numberOfFemaleBenefited}
                    />


                    {/* Total Number of Males Benefited */}
                    <FormInput
                        label="Total number of males that benefited from the initiative."
                        name="numberOfMaleBenefited"
                        type="number"
                        placeholder="Enter number"
                        register={register}
                        registerOptions={{ required: "This field is required." }}
                        error={errors.numberOfMaleBenefited}
                    />


                    {/* Total Number of PwDs Benefited */}
                    <FormInput
                        label="Total number of PwDs that benefited from the initiative."
                        name="numberOfPwDsBenefited"
                        type="number"
                        placeholder="Enter number"
                        register={register}
                        registerOptions={{ required: "This field is required." }}
                        error={errors.numberOfPwDsBenefited}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        buttonText={projectStore.isSaving ? "Saving data..." : "Submit"}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    />
                </form>
            </div>
        </div>
    );
});

export default ProjectThirdForm;