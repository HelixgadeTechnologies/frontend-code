import { RowSelectionState } from "@tanstack/react-table";
import { Observer, observer } from "mobx-react-lite";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CustomSelect, EmptyTable, LoadingTable, Table } from "../../../../components/elements";
import { conflictStore as ConflictStore } from "../../store/conflictStore"
import { IConflictView } from "../../types/interface";
import Tag from "../../../../components/elements/Tag";

import IMG from "../../../../assets/svgs/dashboardConflictNotFound.svg"
import { dashboardStore as DashboardStore } from "../../../dashboard/store/dashboardStore";
import { Controller, useForm } from "react-hook-form";

const dashboardStoreCtx = createContext(DashboardStore);
const ConflictStoreCtx = createContext(ConflictStore);

export const GeneralConflictTable = observer(() => {
    const dashboardStore = useContext(dashboardStoreCtx);
    const conflictStore = useContext(ConflictStoreCtx);
    const { control } = useForm();
    useEffect(() => {
        async function loadRequests() {
            let selectedTrustId = window.sessionStorage.getItem("selectedTrustIdG")
            await conflictStore.getConflicts(selectedTrustId as string);
            conflictStore.selectedConflict = null;
        }
        loadRequests();
    }, []);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const handleView = useCallback(async (conflict: IConflictView) => {
        // console.log(`Approved user : ${conflict}`);
        conflictStore.selectedConflict = conflict
        dashboardStore.selectedTab = 44;
    }, [conflictStore]);

    // Define columns with memoization
    const columns = useMemo(
        () => [
            {
                id: "trustName",
                header: "Trust Name",
                accessorKey: "trustName",
            },
            {
                id: "causeOfConflictName",
                header: "Cause Of Conflict",
                accessorKey: "causeOfConflictName",
            },
            {
                id: "userFirstName",
                header: "Name of agent",
                accessorKey: "userFirstName",
                cell: ({ row }: { row: { original: IConflictView } }) => {
                    const conflict = row.original;
                    const data = `${conflict?.userLastName == null?"":conflict?.userLastName} ${conflict?.userFirstName == null?"":conflict?.userFirstName}`;
                    return <span>{data}</span>;
                },
            },
            {
                id: "issuesAddressByName",
                header: "Issues Address By",
                accessorKey: "issuesAddressByName",
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }: { row: { original: IConflictView } }) => {
                    const conflict = row.original;

                    return (
                        <Observer>
                            {() => (
                                <div className="flex gap-2">
                                    <Tag
                                        label="View"
                                        type="default"
                                        // icon={checkIcon}
                                        onClick={() => handleView(conflict)} // Add your view handler
                                    />
                                </div>
                            )}
                        </Observer>
                    );
                },
            },
        ],
        [handleView],
    );

    const tableHead = ["Project Title", "Cause Of Conflict", "Issues Address By", "Action"];

    const handleFilterChange = (selectedOption: any) => {
        conflictStore.filterConflict(selectedOption?.value); // Example: Update the store with the selected status
    };
    return (
        <>
            <div className="p-4">
                <div className="flex items-center justify-between">
                    {/* Title */}
                    <h1></h1>
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
            <div className="p-4">
                <>
                    {conflictStore.isLoading ? (
                        <LoadingTable headArr={tableHead} />
                    ) : conflictStore.filteredConflicts.size > 0 ? (
                        <Table
                            columns={columns}
                            data={[...conflictStore.filteredConflicts.values()].map((conflict, i: number) => ({
                                ...conflict, id: i.toString()
                            } as IConflictView))
                            }
                            count={conflictStore.filteredConflicts.size}
                            rowSelection={rowSelection}
                            setRowSelection={setRowSelection}
                            totalPage={conflictStore.filteredConflicts.size}
                        // refresh={()=>economicImpactStore.getEconomicImpactByTrustId(trustStore.selectedTrustId)}
                        />
                    ) : (
                        <EmptyTable
                            headArr={tableHead}
                            heading="No Conflict data available."
                            // text={<span>You can  <button className="text-blue-600 text-md font-medium hover:underline" onClick={handleCreate}>click here</button> to make a report</span>}
                            img={IMG}
                        />
                    )}
                </>
                {/* Modals */}
            </div>
        </>
    );
});