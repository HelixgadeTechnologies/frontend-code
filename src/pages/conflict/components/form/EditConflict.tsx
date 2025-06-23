import { useForm, Controller } from "react-hook-form";
import { CustomSelect, Button, FormInput } from "../../../../components/elements";
import { toast } from "react-toastify";
import { ICauseOfConflict, IConflictPayload, IConflictPayloadData, IConflictStatus, IConflictStore, IConflictView, ICourtLitigationStatus, IIssuesAddressBy, IPartiesInvolve } from "../../types/interface";
import { IDropdownProp } from "../../../Settings/types/interface";
// import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
// import { useParams } from "react-router-dom";

const EditConflict = observer(({ close, conflictStore, selectedTrust }: { close: () => void, conflictStore: IConflictStore, selectedTrust: string }) => {
    const { control, reset, register, handleSubmit, formState: { errors } } = useForm();
    useEffect(() => {
        async function loadRequests() {
            if (conflictStore.selectedConflict) {
                let data = conflictStore.selectedConflict as IConflictView

                reset({
                    causeOfConflict: {
                        label: data?.causeOfConflictName,
                        value: String(data?.causeOfConflictId)
                    } as IDropdownProp,
                    partiesInvolved: {
                        label: data.partiesInvolveName,
                        value: String(data.partiesInvolveId)
                    } as IDropdownProp,
                    conflictStatus: {
                        label: data.conflictStatusName,
                        value: String(data.conflictStatusId)
                    } as IDropdownProp,
                    issuesAddressBy: {
                        label: data.issuesAddressByName,
                        value: String(data.issuesAddressById)
                    } as IDropdownProp,
                    courtLitigationStatus: {
                        label: data.courtLitigationStatusName,
                        value: String(data.courtLitigationStatusId)
                    } as IDropdownProp,
                    narrateIssues: data.narrateIssues || "",
                });
            }
        }
        loadRequests();

    }, [conflictStore, reset]);
    const onSubmit = async (data: any) => {
        try {
            // console.log("Form Data:", data);
            const causeOfConflict = data.causeOfConflict as IDropdownProp
            const partiesInvolved = data.partiesInvolved as IDropdownProp
            const conflictStatus = data.conflictStatus as IDropdownProp
            const issuesAddressBy = data.issuesAddressBy as IDropdownProp
            const courtLitigationStatus = data.courtLitigationStatus as IDropdownProp

            const conflictPayloadData: IConflictPayloadData = {
                causeOfConflictId: Number(causeOfConflict.value),
                conflictStatusId: Number(conflictStatus.value),
                narrateIssues: data.narrateIssues,
                partiesInvolveId: Number(partiesInvolved.value),
                issuesAddressById: Number(issuesAddressBy.value),
                courtLitigationStatusId: Number(courtLitigationStatus.value),
                trustId: selectedTrust,
                conflictId: conflictStore.selectedConflict?.conflictId
            };

            const payload: IConflictPayload = {
                isCreate: false,
                data: conflictPayloadData
            }
            const response = await conflictStore.createConflict(payload, selectedTrust)
            if (response) {
                toast.success("Conflict Successfully Update");
                reset({})
                conflictStore.isEditDialogVisible = false;
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
        <div className=" flex ">
            <div className=" relative w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 sm:p-8">
                {/* <GoBack action={closeAddForm} trustName={name || ""} page="conflict" /> */}
                <button
                    onClick={close}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                >
                    ✕
                </button>
                {/* Header */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Conflict Data Reporting Detail
                </h1>
                <p className="text-sm text-gray-600 mb-6">
                    Fill out these details to build your broadcast
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Cause of Conflict */}
                        <div>
                            <Controller
                                control={control}
                                name="causeOfConflict"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomSelect
                                        id="cause-of-conflict-select"
                                        {...field}
                                        options={[...conflictStore.causeOfConflict.values()].map((v: ICauseOfConflict) => ({
                                            label: v?.causeOfConflict as string,
                                            value: v?.causeOfConflictId,
                                        }))}
                                        isLoading={conflictStore.isLoading}
                                        label="Cause of conflict"
                                        placeholder="Enter cause of conflict"
                                    />
                                )}
                            />
                            {errors.causeOfConflict && (
                                <p className="mt-2 text-xs text-red-400">Select a cause of conflict</p>
                            )}
                        </div>

                        {/* Parties Involved */}
                        <div>
                            <Controller
                                control={control}
                                name="partiesInvolved"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomSelect
                                        id="parties-involved-select"
                                        {...field}
                                        options={[...conflictStore.partiesInvolve.values()].map((v: IPartiesInvolve) => ({
                                            label: v?.partiesInvolve as string,
                                            value: v?.partiesInvolveId,
                                        }))}
                                        isLoading={conflictStore.isLoading}
                                        label="Parties involved"
                                        placeholder="Select parties"
                                    />
                                )}
                            />
                            {errors.partiesInvolved && (
                                <p className="mt-2 text-xs text-red-400">Select parties involved</p>
                            )}
                        </div>

                        {/* Status of Conflict */}
                        <div>
                            <Controller
                                control={control}
                                name="conflictStatus"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomSelect
                                        id="status-of-conflict-select"
                                        {...field}
                                        options={[...conflictStore.conflictStatus.values()].map((v: IConflictStatus) => ({
                                            label: v?.conflictStatus as string,
                                            value: v?.conflictStatusId,
                                        }))}
                                        isLoading={conflictStore.isLoading}
                                        label="Status of conflict"
                                        placeholder="Status of conflict"
                                    />
                                )}
                            />
                            {errors.conflictStatus && (
                                <p className="mt-2 text-xs text-red-400">Select a status of conflict</p>
                            )}
                        </div>

                        {/* Issue Addressed By */}
                        <div>
                            <Controller
                                control={control}
                                name="issuesAddressBy"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomSelect
                                        id="issue-addressed-by-select"
                                        {...field}
                                        options={[...conflictStore.issuesAddressBy.values()].map((v: IIssuesAddressBy) => ({
                                            label: v?.issuesAddressBy as string,
                                            value: v?.issuesAddressById,
                                        }))}
                                        isLoading={conflictStore.isLoading}
                                        label="Issue addressed by"
                                        placeholder="Issue addressed by"
                                    />
                                )}
                            />
                            {errors.issuesAddressBy && (
                                <p className="mt-2 text-xs text-red-400">Select who addressed the issue</p>
                            )}
                        </div>
                    </div>
                    {/* Status of Court Litigation */}
                    <div>
                        <Controller
                            control={control}
                            name="courtLitigationStatus"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <CustomSelect
                                    id="court-litigation-status-select"
                                    {...field}
                                    options={[...conflictStore.courtLitigationStatus.values()].map((v: ICourtLitigationStatus) => ({
                                        label: v?.courtLitigationStatus as string,
                                        value: v?.courtLitigationStatusId,
                                    }))}
                                    isLoading={conflictStore.isLoading}
                                    label="Status of the court litigation"
                                    placeholder="Status of the court litigation"
                                />
                            )}
                        />
                        {errors.courtLitigationStatus && (
                            <p className="mt-2 text-xs text-red-400">Select a court litigation status</p>
                        )}
                    </div>

                    {/* Narrate Issues */}
                    <div>
                        <FormInput
                            label="Narrate Issues"
                            name="narrateIssues"
                            type="text"
                            textarea={true}
                            register={register}
                            registerOptions={{
                                required: "Narrate Issues field is required.",
                            }}
                            error={errors.narrateIssues}
                            errorMessage={`Narrate Issues is required`}
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                        <Button
                            onClick={close}
                            className="border text-black bg-white border-gray-7 rounded-lg py-2 px-7"
                            buttonText="Cancel"
                            width="w-fit"
                            type="button"

                        />
                        <Button
                            padding="py-3"
                            buttonText={conflictStore.isSubmitting ? "Updating..." : "Update"}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
});

export default EditConflict;