import { RowSelectionState } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EmptyTable, LoadingTable, Table } from "../../../../components/elements";
import { observer } from "mobx-react-lite";
import { IConflictStore, IConflictView } from "../../types/interface";
import ActiveViewMenu from "../../../../components/elements/ActivationViewMenu";
// import ConflictDashboardView from "../modal/ConflictDashboardView";
import dayjs from 'dayjs';
import IMG from "../../../../assets/svgs/dashboardConflictNotFound.svg"


export const UnresolvedConflict = observer(({ conflictStore }: { conflictStore: IConflictStore }) => {

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Toggle action menu
    const toggleMenu = useCallback(
        (conflictId: string) => {
            setActiveMenu(activeMenu === conflictId ? null : conflictId);
        },
        [activeMenu],
    );

    // Handle edit account
    const handleView = useCallback((conflict: IConflictView | null = null) => {
        conflictStore.selectedConflict = conflict
        conflictStore.conflictBaseView = 4
    }, []);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Only close if clicking outside both the menu and the trigger button
            if (
                activeMenu &&
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !(event.target as Element).closest(
                    `[data-menu-trigger="${activeMenu}"]`,
                )
            ) {
                setActiveMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeMenu]);

    // Define columns with memoization
    const columns = useMemo(
        () => [
            {
                id: "projectTitle",
                header: "Project Title",
                accessorKey: "projectTitle"
            },
            {
                id: "createAt",
                header: "Report Date",
                accessorKey: "createAt",
                cell: ({ row }: { row: { original: IConflictView } }) => {
                    const formatted = dayjs(row.original.createAt).format('MMM DD, YYYY hh:mmA');
                    return <span>{formatted}</span>;
                },
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }: { row: { original: IConflictView } }) => {
                    const conflict = row.original;

                    return (
                        <div className="relative">
                            <button
                                data-menu-trigger={conflict?.conflictId}
                                className="px-3 text-gray-5 hover:text-gray-7 cursor-pointer"
                                onClick={() => toggleMenu(conflict?.conflictId)}
                                aria-label="More options"
                            >
                                •••
                            </button>
                            <ActiveViewMenu
                                conflictId={conflict?.conflictId}
                                activeMenu={activeMenu}
                                menuRef={menuRef}
                                handleView={() => handleView(conflict)}
                            />
                        </div>
                    );
                },
            },
        ],
        [activeMenu, toggleMenu, handleView],
    );

    const tableHead = ["Project Title", "Report Date", "action"];

    return (
        <div className="mt-10 bg-white p-4 rounded-2xl border border-gray-8 ">
            <>
                {conflictStore.dashboardData == null ? (
                    <LoadingTable headArr={tableHead} />
                ) : conflictStore.dashboardData?.UNRESOLVED_CONFLICTS?.length! > 0 ? (
                    <Table
                        columns={columns}
                        data={conflictStore?.dashboardData?.UNRESOLVED_CONFLICTS?.map((conflict: IConflictView, i: number) => ({
                            ...conflict, id: i.toString()
                        } as IConflictView))!
                        }
                        count={conflictStore.dashboardData?.UNRESOLVED_CONFLICTS?.length!}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                    />
                ) : (
                    <EmptyTable
                        headArr={tableHead}
                        heading="No resolved conflict."
                        img={IMG}
                    />
                )}
            </>

            {/* Modals */}
            {/* {conflictStore.unResolvedConflict && (
                <Modal
                    body={
                        <ConflictDashboardView
                            close={() => conflictStore.unResolvedConflict = null}
                            conflict={conflictStore.unResolvedConflict!}
                        />
                    }
                />
            )} */}
        </div>
    );
});