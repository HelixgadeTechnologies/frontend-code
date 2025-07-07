import { Controller, useForm } from "react-hook-form";
import { CustomSelect, GoBack } from "../../../../components/elements";
import { IConflictStore } from "../../types/interface";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

const ConflictTableHeader = observer(({ conflictStore }: { conflictStore: IConflictStore }) => {
    const { control } = useForm();
    const { name } = useParams();

    const closeTable = useCallback(() => {
        conflictStore.conflictBaseView = 1;
    }, [conflictStore]);

    const handleFilterChange = (selectedOption: any) => {
        conflictStore.filterConflict(selectedOption?.value); // Example: Update the store with the selected status
    };

    return (
        <div className="p-4">
            <GoBack action={closeTable} trustName={name || ""} page="Conflict" />
            <div className="flex items-center justify-between mb-6 p-6">
                {/* Title */}
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">Conflict List</h1>

                {/* Filter Dropdown */}
                <div className="flex items-center gap-4" >
                    {/* <label className="text-sm font-medium text-gray-700">Filter By</label> */}
                    <Controller
                    
                        control={control}
                        name="filterStatus"
                        render={({ field }) => (
                            <CustomSelect
                            
                                id="filter-status-select"
                                {...field}
                                options={
                                    [
                                        { label: "All Conflict", value: 0 },
                                        { label: "Resolved Conflict", value: 1 },
                                        { label: "Pending Conflict", value: 2 },
                                        { label: "Conflict In Court", value: 3 },
                                        { label: "State Government", value: 4 }
                                    ]
                                }
                                onChange={(selectedOption) => {
                                    field.onChange(selectedOption); // Update the form state
                                    handleFilterChange(selectedOption); // Perform the action
                                }}
                                label="Filter By"
                                // isLoading={conflictStore.isLoading}
                                placeholder="Conflict Status"
                            />
                        )}
                    />
                </div>

            </div>

        </div>
    );
});

export default ConflictTableHeader;