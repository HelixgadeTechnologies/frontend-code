import { RowSelectionState } from "@tanstack/react-table";
import { Observer, observer } from "mobx-react-lite";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EmptyTable, LoadingTable, Modal, Table } from "../../../../components/elements";
import { conflictStore as ConflictStore } from "../../store/conflictStore"
import { projectStore as ProjectStore } from "../../../project/store/projectStore"
import { trustStore as TrustStore } from "../../../trust/store/trustStore"
import { IConflictView } from "../../types/interface";
import Tag from "../../../../components/elements/Tag";
import ConflictTableHeader from "./ConflictTableHeader";
import ConflictView from "../modal/ConflictView";
import EditConflict from "../form/EditConflict";
import IMG from "../../../../assets/svgs/dashboardConflictNotFound.svg"
import ConflictForm from "../form/ConflictForm";

const ConflictStoreCtx = createContext(ConflictStore);
const ProjectStoreCtx = createContext(ProjectStore);
const TrustStoreCtx = createContext(TrustStore);

export const ConflictTable = observer(() => {
    const conflictStore = useContext(ConflictStoreCtx);
    const projectStore = useContext(ProjectStoreCtx);
    const trustStore = useContext(TrustStoreCtx);

    useEffect(() => {
        async function loadRequests() {
            let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
            await conflictStore.getConflicts(selectedTrustId as string);
            conflictStore.selectedConflict = null;
        }
        loadRequests();
    }, []);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});



    const handleCreate = useCallback(() => {
        conflictStore.isReportDialogVisible = true
    }, [conflictStore]);

    const handleView = useCallback(async (conflict: IConflictView) => {
        // console.log(`Approved user : ${conflict}`);
        conflictStore.selectedConflict = conflict
    }, [conflictStore]);

    const handleEdit = useCallback(async (conflict: IConflictView) => {
        conflictStore.selectedConflict = conflict;
        conflictStore.isEditDialogVisible = true;
    }, [conflictStore]);


    // Define columns with memoization
    const columns = useMemo(
        () => [
            {
                id: "projectTitle",
                header: "Project Title",
                accessorKey: "projectTitle",
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
                    const data = `${conflict.userLastName} ${conflict.userFirstName}`;
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
                                    <Tag
                                        label="Edit"
                                        type="default"
                                        // icon={editIcon}
                                        onClick={() => handleEdit(conflict)} // Add your view handler
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

    return (
        <>
            <ConflictTableHeader conflictStore={conflictStore} />
            <div className="mt-10 bg-white p-4  border border-gray-8 ">
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
                        // refresh={()=>economicImpactStore.getEconomicImpactByTrustId(trustStore.selectedTrustId)}
                        />
                    ) : (
                        <EmptyTable
                            headArr={tableHead}
                            heading="No Conflict data available."
                            text={<span>You can  <button className="text-blue-600 text-md font-medium hover:underline" onClick={handleCreate}>click here</button> to make a report</span>}
                            img={IMG}
                        />
                    )}
                </>
                {/* Modals */}
                {conflictStore.selectedConflict && !conflictStore.isEditDialogVisible && (
                    <Modal
                        body={
                            <ConflictView
                                close={() => conflictStore.selectedConflict = null}
                                conflictStore={conflictStore}
                            />
                        }
                        close={() => conflictStore.selectedConflict = null}
                    />
                )}
                {conflictStore.isEditDialogVisible && conflictStore.isEditDialogVisible && (
                    <Modal
                        body={
                            <EditConflict
                                conflictStore={conflictStore}
                                projectStore={projectStore}
                                selectedTrust={trustStore.selectedTrustId as string}
                                close={() => { conflictStore.isEditDialogVisible = false; conflictStore.selectedConflict = null }}
                            />
                        }
                        close={() => { conflictStore.isEditDialogVisible = false; conflictStore.selectedConflict = null }}
                    />
                )}

                {conflictStore.isReportDialogVisible && (
                    <Modal
                        body={
                            <ConflictForm
                                conflictStore={conflictStore}
                                projectStore={projectStore}
                                selectedTrust={trustStore.selectedTrustId as string}
                                close={() => conflictStore.isReportDialogVisible = false}
                            />
                        }
                        close={() => conflictStore.isReportDialogVisible = false}
                    />
                )}
            </div>
        </>
    );
});