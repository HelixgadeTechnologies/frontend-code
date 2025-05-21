import { createContext, useContext } from "react";
import { Controller } from "react-hook-form";
import { CustomSelect, FormInput, Button } from "../../../../components/elements";
import { IProjectCategory, IProjectPayloadData } from "../../types/interface";
import { projectStore as ProjectStore } from "../../store/projectStore";
import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const ProjectStoreCTX = createContext(ProjectStore);
const ProjectFirstForm = observer(({ method }: { method: any }) => {
    const projectStore = useContext(ProjectStoreCTX);
    const { control, register, handleSubmit, formState: { errors } } = method;

    const onSubmit = (data: any) => {
        projectStore.isSaving = true
        // console.log("Form Data:", data, );
        const date = new Date(data.awardDate);
        const isoUTC = date.toISOString();

        const projectFormData: IProjectPayloadData = {
            projectTitle: data.projectTitle,
            projectCategoryId: data.projectCategoryId.value,
            totalBudget: Number(data.totalBudget),
            community: data.community,
            awardDate: isoUTC,
            nameOfContractor: data.nameOfContractor,
            annualApprovedBudget: data.annualApprovedBudget,
        }


        //save to store
        projectStore.projectFormData = projectFormData
        projectStore.isSaving = false
        //move to the next form
        projectStore.setCompletedTab();
    };



    return (
        <div>
            <div className="bg-white  p-6 sm:p-8 ">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold text-gray-800">Project</h1>
                    <p className="text-sm text-gray-600">Fill out these details</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Project Title */}
                    <FormInput
                        label="Project Title"
                        name="projectTitle"
                        type="text"
                        placeholder="Enter project name"
                        register={register}
                        registerOptions={{ required: "Project Title is required." }}
                        error={errors.projectTitle}
                    />

                    {/* Project Category */}

                    <div>
                        <Controller
                            control={control}
                            name="projectCategoryId"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <CustomSelect
                                    id="projectCategory-select"
                                    {...field}
                                    options={[...projectStore.projectCategories.values()].map((v: IProjectCategory) => {
                                        return {
                                            label: String(v?.categoryName),
                                            value: v?.projectCategoryId
                                        }
                                    })}
                                    // isLoading={projectStore.isLoading}
                                    label="Project Category"
                                    placeholder="projectCategory"
                                />
                            )}
                        />
                        {errors.projectCategoryId && (
                            <p className="mt-2 mb-4 text-xs  text-red-400 ">Select a Project Category</p>
                        )}
                    </div>

                    {/* Total Budget */}
                    <div>
                        <FormInput
                            label="Total Budget"
                            name="totalBudget"
                            type="text"
                            placeholder="Enter total budget"
                            register={register}
                            registerOptions={{ required: "Total budget is required." }}
                            error={errors.totalBudget}
                        />
                    </div>

                    {/* Community */}
                    <div>
                        <FormInput
                            label="Community"
                            name="community"
                            type="text"
                            placeholder="Enter community"
                            register={register}
                            registerOptions={{ required: "Community is required." }}
                            error={errors.totalBudget}
                        />
                    </div>

                    {/* Award Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Award Date
                        </label>
                        <Controller
                            control={control}
                            name="awardDate"
                            rules={{ required: "Award Date is required." }}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    selected={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select Award Date"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        />
                        {errors.awardDate && (
                            <p className="mt-2 text-xs text-red-400">
                                Select date
                            </p>
                        )}
                    </div>

                    {/* Name of Contractor */}
                    <FormInput
                        label="Name of Contractor"
                        name="nameOfContractor"
                        type="text"
                        placeholder="Enter contractor name"
                        register={register}
                        registerOptions={{ required: "Contractor Name is required." }}
                        error={errors.nameOfContractor}
                    />

                    {/* Annual Approved Budget */}
                    <FormInput
                        label="Annual Approved Budget"
                        name="annualApprovedBudget"
                        type="text"
                        placeholder="Enter approved budget"
                        register={register}
                        registerOptions={{ required: "Approved Budget is required." }}
                        error={errors.annualApprovedBudget}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        buttonText={projectStore.isSaving ? "Saving data..." : "Next"}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

                    />
                </form>
            </div>
        </div>
    );
});

export default ProjectFirstForm;