import { createContext, useCallback, useContext, useEffect } from "react";
import { projectStore as ProjectStore } from "../../store/projectStore";
import { observer } from "mobx-react-lite";
import { IProjectPayloadData, IQualityRating, IStatusReport, ITypeOfWork, IUploadPayload } from "../../types/interface";
import { GoBack, CustomSelect, FormInput, Button, FileUpload } from "../../../../components/elements";
import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ProjectStoreCTX = createContext(ProjectStore)

const ProjectReportForm = observer(() => {
    const projectStore = useContext(ProjectStoreCTX)
    const { name } = useParams();

    const method = useForm({
        defaultValues: {
            ...projectStore.projectFormData,
            typeOfWork: projectStore.projectFormData.typeOfWork?.split(", ").map((item: string) => ({ value: item, label: item })),
            projectStatus: { value: projectStore.projectFormData.projectStatus!, label: projectStore.selectedProject?.projectStatusName || "" },
            qualityRatingId: { value: projectStore.projectFormData.qualityRatingId!, label: projectStore.selectedProject?.qualityRatingName || "" },
        },
        mode: "onChange"
    })

    const { control, register, handleSubmit, formState: { errors }, reset } = method;

    useEffect(() => {
        projectStore.isSaving = false; // Reset stale loading state on mount
        async function loadRequests() {
            await projectStore.getCategory()
            await projectStore.getTypeOfWork()
            await projectStore.getStatusReport()
            await projectStore.getQualityRatting()
        }
        loadRequests();
    }, []);

    const closeTable = useCallback(() => {
        projectStore.selectedProjectScreen = 1;
    }, [projectStore]);

    const convertFileToBase64 = (file: File): Promise<IUploadPayload> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                const base64String = result.split(',')[1];
                const mimeType = result.split(';')[0].split(':')[1];
                resolve({ base64String, mimeType });
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }

    const onSubmit = async (data: any) => {
        try {
            projectStore.isSaving = true;

            const reportData: any = {
                projectStatus: data.projectStatus.value,
                qualityRatingId: data.qualityRatingId.value,
                projectVideo: data.projectVideo,
                projectVideoMimeType: data.projectVideoMimeType || projectStore.selectedProject?.projectVideoMimeType,
                numberOfFemaleEmployedByContractor: Number(data.numberOfFemaleEmployedByContractor),
                numberOfMaleEmployedByContractor: Number(data.numberOfMaleEmployedByContractor),
                numberOfPwDsEmployedByContractor: Number(data.numberOfPwDsEmployedByContractor),
                typeOfWork: data.typeOfWork.map((d: any) => d.label).join(", "),
                numberOfHostCommunityMemberContracted: Number(data.numberOfHostCommunityMemberContracted),
                numberOfFemaleBenefited: Number(data.numberOfFemaleBenefited),
                numberOfMaleBenefited: Number(data.numberOfMaleBenefited),
                numberOfPwDsBenefited: Number(data.numberOfPwDsBenefited),
            };

            const response = await projectStore.reportProject(projectStore.projectFormData.projectId as string, reportData);
            if (response) {
                toast.success("Project Report Successfully Submitted");
                projectStore.selectedProjectScreen = 1;
                projectStore.projectFormData = {} as IProjectPayloadData;
                reset();
            }
        } catch (error: any) {
            toast.error(error?.response?.body?.message || error?.message || "Failed to submit report");
        } finally {
            projectStore.isSaving = false;
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <GoBack action={closeTable} trustName={name || ""} page="project" />
                    <h1 className="text-2xl font-bold text-gray-800 mt-4">
                        Project Progress & Impact Report
                    </h1>
                    <p className="text-gray-600 mt-2">Updating: <span className="font-semibold">{projectStore.selectedProject?.projectTitle}</span></p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="md:col-span-2 border-b pb-2 mb-2">
                            <h2 className="text-lg font-semibold text-blue-600">Status & Quality</h2>
                        </div>

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
                                        placeholder="Select status"
                                        options={[...projectStore.statusReport.values()].map((v: IStatusReport) => ({
                                            label: String(v?.statusReport),
                                            value: v?.statusReportId
                                        }))}
                                    />
                                )}
                            />
                            {errors.projectStatus && <p className="mt-1 text-xs text-red-500">Project status is required</p>}
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
                                        placeholder="Select rating"
                                        options={[...projectStore.qualityRating.values()].map((v: IQualityRating) => ({
                                            label: String(v?.qualityRating),
                                            value: v?.qualityRatingId
                                        }))}
                                    />
                                )}
                            />
                            {errors.qualityRatingId && <p className="mt-1 text-xs text-red-500">Quality rating is required</p>}
                        </div>

                        <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
                            <h2 className="text-lg font-semibold text-blue-600">Employment Details</h2>
                        </div>

                        <FormInput
                            label="Number ofFemales employed by contractor"
                            name="numberOfFemaleEmployedByContractor"
                            type="number"
                            placeholder="0"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.numberOfFemaleEmployedByContractor}
                        />

                        <FormInput
                            label="Number of Males employed by contractor"
                            name="numberOfMaleEmployedByContractor"
                            type="number"
                            placeholder="0"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.numberOfMaleEmployedByContractor}
                        />

                        <FormInput
                            label="PwDs employed by contractor"
                            name="numberOfPwDsEmployedByContractor"
                            type="number"
                            placeholder="0"
                            register={register}
                            registerOptions={{ required: "Required" }}
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
                                        placeholder="Select types"
                                        options={[...projectStore.typeOfWork.values()].map((v: ITypeOfWork) => ({
                                            label: String(v?.typeOfWork),
                                            value: v?.typeOfWorkId
                                        }))}
                                        isMulti
                                    />
                                )}
                            />
                            {errors.typeOfWork && <p className="mt-1 text-xs text-red-500">Type of work is required</p>}
                        </div>

                        <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
                            <h2 className="text-lg font-semibold text-blue-600">Beneficiary & Community Impact</h2>
                        </div>

                        <FormInput
                            label="Host community members contracted by project"
                            name="numberOfHostCommunityMemberContracted"
                            type="number"
                            placeholder="0"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.numberOfHostCommunityMemberContracted}
                        />

                        <FormInput
                            label="Female beneficiary"
                            name="numberOfFemaleBenefited"
                            type="number"
                            placeholder="0"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.numberOfFemaleBenefited}
                        />

                        <FormInput
                            label="Male beneficiary"
                            name="numberOfMaleBenefited"
                            type="number"
                            placeholder="0"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.numberOfMaleBenefited}
                        />

                        <FormInput
                            label="PwDs beneficiary"
                            name="numberOfPwDsBenefited"
                            type="number"
                            placeholder="0"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.numberOfPwDsBenefited}
                        />

                        <div className="md:col-span-2 mt-4">
                            <FileUpload
                                name="projectVideo"
                                control={control}
                                label="Update Project Document/Video/Image"
                                helperText="PDF/Video/Image format • Max. 5MB"
                                accept="application/pdf,video/*,image/*"
                                maxSize={5 * 1024 * 1024}
                                buttonText="Upload"
                                onFileSelected={async (file) => {
                                    if (file) {
                                        try {
                                            const payload = await convertFileToBase64(file);
                                            const res = await projectStore.uploadFile(payload);
                                            if (res.success) {
                                                method.setValue("projectVideo", res.data);
                                                method.setValue("projectVideoMimeType", file.type);
                                                toast.success("File uploaded successfully");
                                            }
                                        } catch (error) {
                                            toast.error("Upload failed");
                                        }
                                    }
                                }}
                            />
                            {method.watch("projectVideo") && (
                                <p className="text-xs text-gray-500 mt-1">Uploaded file: <a href={method.watch("projectVideo")} target="_blank" className="text-blue-600 hover:underline">View here</a></p>
                            )}
                        </div>

                        <div className="md:col-span-2 mt-8">
                            <Button
                                type="submit"
                                buttonText={projectStore.isSaving ? "Submitting Report..." : "Submit Project Report"}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-colors"
                                disabled={projectStore.isSaving}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
});

export default ProjectReportForm;
