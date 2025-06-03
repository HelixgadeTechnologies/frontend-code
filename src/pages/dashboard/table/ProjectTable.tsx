import { RowSelectionState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
// import { EmptyTable, LoadingTable, Table } from "../../../../components/elements";
import { observer } from "mobx-react-lite";
// import { IConflictStore, IConflictView } from "../../types/interface";
// import ActiveViewMenu from "../../../../components/elements/ActivationViewMenu";

// import ConflictDashboardView from "../modal/ConflictDashboardView";
import dayjs from 'dayjs';
import IMG from "../../../assets/svgs/dashboardConflictNotFound.svg"
import { EmptyTable, LoadingTable, Table } from "../../../components/elements";

export const ProjectTable = observer(({ conflictStore }: { conflictStore: any }) => {

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Handle edit account
    // const handleView = useCallback((conflict: IConflictView | null = null) => {
    //     conflictStore.selectedConflict = conflict
    //     conflictStore.conflictBaseView = 4
    // }, []);



    // Define columns with memoization
    const columns = useMemo(
        () => [
            {
                id: "trustName",
                header: "Trust",
                accessorKey: "trustName"
            },
            {
                id: "projectTitle",
                header: "Project",
                accessorKey: "projectTitle"
            },
            {
                id: "createAt",
                header: "Report Date",
                accessorKey: "createAt",
                cell: ({ row }: { row: { original: any } }) => {
                    const formatted = dayjs(row.original.createAt).format('MMM DD, YYYY hh:mmA');
                    return <span>{formatted}</span>;
                },
            },
            {
                id: "rate",
                header: "Rating",
                accessorKey: "rate",
                cell: ({ row }: { row: { original: any } }) => {
                    const formatted = dayjs(row.original.createAt).format('MMM DD, YYYY hh:mmA');
                    return <span>{formatted}</span>;
                },
            },

        ],
        [],
    );

    const tableHead = ["Project Title", "Report Date", "action"];

    return (
        <div className="mt-10 bg-white p-4 rounded-2xl border border-gray-8 ">
            <>
                {conflictStore.dashboardData == null ? (
                    <LoadingTable headArr={tableHead} />
                ) : conflictStore.dashboardData?.RESOLVED_CONFLICTS?.length! > 0 ? (
                    <Table
                        columns={columns}
                        data={conflictStore?.dashboardData?.RESOLVED_CONFLICTS?.map((conflict: any, i: number) => ({
                            ...conflict, id: i.toString()
                        } as any))!
                        }
                        count={conflictStore.dashboardData?.RESOLVED_CONFLICTS?.length!}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                    />
                ) : (
                    <EmptyTable
                        headArr={tableHead}
                        heading="No Project."
                        img={IMG}
                    />
                )}
            </>

            {/* Modals */}
            {/* {conflictStore.resolvedConflict && (
                <Modal
                    body={
                        <ConflictDashboardView
                            close={() => conflictStore.resolvedConflict = null}
                            conflict={conflictStore.resolvedConflict}
                        />
                    }
                />
            )} */}
        </div>
    );
});