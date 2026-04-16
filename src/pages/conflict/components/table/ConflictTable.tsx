import { RowSelectionState } from "@tanstack/react-table";
import { Observer, observer } from "mobx-react-lite";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, EmptyTable, LoadingTable, Modal, Table } from "../../../../components/elements";
import { conflictStore as ConflictStore } from "../../store/conflictStore"
import { trustStore as TrustStore } from "../../../trust/store/trustStore"
import { IConflictView } from "../../types/interface";
import Tag from "../../../../components/elements/Tag";
import ConflictTableHeader from "./ConflictTableHeader";
// import ConflictView from "../modal/ConflictView";
import EditConflict from "../form/EditConflict";
import IMG from "../../../../assets/svgs/dashboardConflictNotFound.svg"
import ConflictForm from "../form/ConflictForm";
import { authStore } from "../../../auth/store/authStore";
import { toast } from "react-toastify";

const ConflictStoreCtx = createContext(ConflictStore);
const TrustStoreCtx = createContext(TrustStore);

export const ConflictTable = observer(() => {
    const conflictStore = useContext(ConflictStoreCtx);
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
    const [conflictToDelete, setConflictToDelete] = useState<IConflictView | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10); // items per page



    const handleCreate = useCallback(() => {
        conflictStore.isReportDialogVisible = true
    }, [conflictStore]);

    const handleView = useCallback(async (conflict: IConflictView) => {
        // console.log(`Approved user : ${conflict}`);
        conflictStore.selectedConflict = conflict
        conflictStore.conflictBaseView = 3
    }, [conflictStore]);

    const handleEdit = useCallback(async (conflict: IConflictView) => {
        conflictStore.selectedConflict = conflict;
        conflictStore.isEditDialogVisible = true;
    }, [conflictStore]);

    const confirmDelete = useCallback(async (conflict: IConflictView) => {
        try {
            const response = await conflictStore.deleteConflict(conflict.conflictId as string);
            if (response) {
                toast.success("Conflict deleted successfully.");
                let selectedTrustId = window.sessionStorage.getItem("selectedTrustId");
                await conflictStore.getConflicts(selectedTrustId as string);
                setConflictToDelete(null);
            }
        } catch (error: any) {
            const message = error?.response?.body?.error || "Failed to delete conflict";
            toast.error(message);
        }
    }, [conflictStore]);


    // Define columns with memoization
    const columns = useMemo(() => [
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
                const data = `${conflict?.userLastName == null ? "" : conflict?.userLastName} ${conflict?.userFirstName == null ? "" : conflict?.userFirstName}`;
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
                                    onClick={() => handleView(conflict)}
                                />
                                <Tag
                                    label="Edit"
                                    type="default"
                                    onClick={() => handleEdit(conflict)}
                                />
                                {authStore?.user?.role === "SUPER ADMIN" && (
                                    <Tag
                                        label="Delete"
                                        type="reject"
                                        onClick={() => setConflictToDelete(conflict)}
                                    />
                                )}
                            </div>
                        )}
                    </Observer>
                );
            },
        },
    ], [handleView, handleEdit]);

    const tableHead = ["Project Title", "Cause Of Conflict", "Issues Address By", "Action"];

    // Prepare paginated data
    const allData = [...conflictStore.filteredConflicts.values()].map((conflict, i: number) => ({ ...conflict, id: i.toString() } as IConflictView));
    const totalCount = allData.length;
    const totalPage = Math.max(1, Math.ceil(totalCount / pageSize));
    const cp = Math.min(Math.max(1, currentPage), totalPage);
    const start = (cp - 1) * pageSize;
    const paged = allData.slice(start, start + pageSize);

    // reset to first page when the filtered list changes (e.g., after filtering/search)
    useEffect(() => {
        setCurrentPage(1);
    }, [conflictStore.filteredConflicts.size]);

    return (
        <>
            <ConflictTableHeader conflictStore={conflictStore} />
            <div className="mt-10 bg-white p-4  border border-gray-8 ">
                <>
                    {conflictStore.isLoading ? (
                        <LoadingTable headArr={tableHead} />
                    ) : totalCount > 0 ? (
                        <Table
                            columns={columns}
                            data={paged}
                            count={totalCount}
                            currentPage={cp}
                            setCurrentPage={setCurrentPage}
                            totalPage={totalPage}
                            rowSelection={rowSelection}
                            setRowSelection={setRowSelection}
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
                {conflictToDelete && (
                    <Modal
                        body={
                            <div className="p-6 bg-white rounded-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
                                <p className="text-gray-600 mb-8">Are you sure you want to delete this conflict? This action cannot be undone.</p>
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        onClick={() => setConflictToDelete(null)}
                                        border={true}
                                        buttonText="Cancel"
                                        type="button"
                                        padding="py-2.5 px-6"
                                        width="w-auto"
                                    />
                                    <Button
                                        onClick={() => confirmDelete(conflictToDelete)}
                                        bg="bg-red-600 hover:bg-red-700 text-white"
                                        buttonText={conflictStore.isSubmitting ? "Deleting..." : "Delete"}
                                        type="button"
                                        padding="py-2.5 px-6"
                                        width="w-auto"
                                        disabled={conflictStore.isSubmitting}
                                    />
                                </div>
                            </div>
                        }
                        close={() => setConflictToDelete(null)}
                    />
                )}
                {/* {conflictStore.selectedConflict && !conflictStore.isEditDialogVisible && (
                    <Modal
                        body={
                            <ConflictView
                                close={() => conflictStore.selectedConflict = null}
                                conflictStore={conflictStore}
                            />
                        }
                        close={() => conflictStore.selectedConflict = null}
                    />
                )} */}
                {conflictStore.isEditDialogVisible && conflictStore.isEditDialogVisible && (
                    <Modal
                        body={
                            <EditConflict
                                conflictStore={conflictStore}
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