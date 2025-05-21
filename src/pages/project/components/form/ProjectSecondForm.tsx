import { Controller } from "react-hook-form";
import { CustomSelect, FormInput, Button, FileUpload } from "../../../../components/elements";
import { observer } from "mobx-react-lite";
import { projectStore as ProjectStore } from "../../store/projectStore";
import { createContext, useContext } from "react";
import { IProjectPayloadData, IQualityRating, IStatusReport, ITypeOfWork, IUploadPayload } from "../../types/interface";

const projectStoreCTX = createContext(ProjectStore);
const ProjectSecondForm = observer(({ method }: { method: any }) => {
    const projectStore = useContext(projectStoreCTX)
    const { control, register, handleSubmit, formState: { errors } } = method;
    const convertFileToBase64 = (file: File): Promise<IUploadPayload> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const result = reader.result as string;
                const base64String = result.split(',')[1]; // remove data:<mime>;base64, part
                const mimeType = result.split(';')[0].split(':')[1];
                resolve({ base64String, mimeType });
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    }
    const onSubmit = (data: any) => {
        projectStore.isSaving = true
        async function loadRequests() {
           
            let uploadPayload = data.projectVideo == undefined?undefined:await convertFileToBase64(data.projectVideo)

            const uploadRes =uploadPayload == undefined?{success:false,message:"",data:""}: await projectStore.uploadFile(uploadPayload)

            const projectFormData: IProjectPayloadData = {
                ...projectStore.projectFormData,
                numberOfMaleEmployedByContractor:Number(data.numberOfMaleEmployedByContractor),
                numberOfFemaleEmployedByContractor: Number(data.numberOfFemaleEmployedByContractor),
                numberOfPwDsEmployedByContractor: Number(data.numberOfPwDsEmployedByContractor),
                projectStatus: data.projectStatus.value,
                qualityRatingId: data.qualityRatingId.value,
                typeOfWork: data.typeOfWork.map((d: any) => d.label).join(", "),
                projectVideo: uploadRes.success ? uploadRes.data : "",
                projectVideoMimeType:uploadPayload == undefined?"":uploadPayload.mimeType

            }

            //save to store
            projectStore.projectFormData = projectFormData
            projectStore.isSaving = false
            //move to the next form
            projectStore.setCompletedTab();

        }
        loadRequests()

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
                    {/* Project Status */}
                    <div>
                        <Controller
                            control={control}
                            name="projectStatus"
                            rules={{ required: "Project Status is required." }}
                            render={({ field }) => (
                                <CustomSelect
                                    id="projectStatus-select"
                                    {...field}
                                    label="Project Status"
                                    placeholder="Yet to start"
                                    options={[...projectStore.statusReport.values()].map((v: IStatusReport) => {
                                        return {
                                            label: String(v?.statusReport),
                                            value: v?.statusReportId
                                        }
                                    })}
                                // error={errors.projectStatus}
                                />
                            )}
                        />
                        {errors.projectStatus && (
                            <p className="mt-2 mb-4 text-xs  text-red-400 ">Select typeOfWork</p>
                        )}
                    </div>

                    {/* Quality Rating */}
                    <div>
                        <Controller
                            control={control}
                            name="qualityRatingId"
                            rules={{ required: "Quality Rating is required." }}
                            render={({ field }) => (
                                <CustomSelect
                                    id="qualityRating-select"
                                    {...field}
                                    label="Quality Rating"
                                    placeholder="Enter rating"
                                    options={[...projectStore.qualityRating.values()].map((v: IQualityRating) => {
                                        return {
                                            label: String(v?.qualityRating),
                                            value: v?.qualityRatingId
                                        }
                                    })}
                                // error={errors.qualityRating}
                                />
                            )}
                        />
                        {errors.qualityRatingId && (
                            <p className="mt-2 mb-4 text-xs  text-red-400 ">Select typeOfWork</p>
                        )}
                    </div>

                    {/* Upload Video */}

                    <FileUpload
                        name="projectVideo"
                        control={control}
                        label="Upload your document"
                        helperText="PDF format • Max. 5MB"
                        accept="application/pdf"
                        maxSize={5 * 1024 * 1024} // 5MB
                        buttonText="Upload"
                    />

                    {/* Number of Trust Community Members */}
                    <p className="text-sm text-gray-600">Number of Trust community members who were locally employed/contracted to project.</p>

                    {/* Total Number of Females */}
                    <FormInput
                        label="Total number of females employed by the contractor."
                        name="numberOfFemaleEmployedByContractor"
                        type="number"
                        placeholder="Enter number"
                        register={register}
                        registerOptions={{ required: "This field is required." }}
                        error={errors.numberOfFemaleEmployedByContractor}
                    />

                    {/* Total Number of Males */}
                    <FormInput
                        label="Total number of males employed by the contractor."
                        name="numberOfMaleEmployedByContractor"
                        type="number"
                        placeholder="Enter number"
                        register={register}
                        registerOptions={{ required: "This field is required." }}
                        error={errors.numberOfMaleEmployedByContractor}
                    />

                    {/* Number of PwDs */}
                    <FormInput
                        label="Number of PwDs employed by the contractor."
                        name="numberOfPwDsEmployedByContractor"
                        type="number"
                        placeholder="Enter number"
                        register={register}
                        registerOptions={{ required: "This field is required." }}
                        error={errors.numberOfPwDsEmployedByContractor}
                    />

                    {/* Type of Work */}
                    <div>
                        <Controller
                            control={control}
                            name="typeOfWork"
                            rules={{ required: "Type of work is required." }}
                            render={({ field }) => (
                                <CustomSelect
                                    id="typeOfWork-select"
                                    {...field}
                                    label="Type of work"
                                    placeholder="Select type of work"
                                    options={[...projectStore.typeOfWork.values()].map((v: ITypeOfWork) => {
                                        return {
                                            label: String(v?.typeOfWork),
                                            value: v?.typeOfWorkId
                                        }
                                    })}
                                    isMulti
                                />
                            )}
                        />
                        {errors.typeOfWork && (
                            <p className="mt-2 mb-4 text-xs  text-red-400 ">Select typeOfWork</p>
                        )}
                    </div>

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

export default ProjectSecondForm;