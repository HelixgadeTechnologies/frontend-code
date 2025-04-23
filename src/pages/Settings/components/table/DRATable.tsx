import { RowSelectionState } from "@tanstack/react-table";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import ActiveMenu from "../../../../components/elements/ActiveMenu";
import { caretDownIcon, filterIcon, sortIcon } from "../../../../assets/icons";
import { EmptyTable, LoadingTable, Modal, Table } from "../../../../components/elements";
import { observer } from "mobx-react-lite";
import { settingStore as SettingStore } from "../../store/settingStore"
import { IDra } from "../../types/interface";
import { DeleteDRA } from "../form/DeleteDRA";
import { trustStore as TrustStore } from "../../../trust/store/trustStore";
import { EditDRA } from "../form/EditDRA";


const SettingsStoreCtx = createContext(SettingStore);
const TrustStoreCtx = createContext(TrustStore);

export const DRATable = observer(() => {
    const settingStore = useContext(SettingsStoreCtx);
    const trustStore = useContext(TrustStoreCtx);

    useEffect(() => {
        async function loadRequests() {
            await settingStore.getAllDra()
            await settingStore.getRole();
            await trustStore.getAllTrust();
            // await settingStore.getAllAdmin()
            // await settingStore.getAllNUPRC()
            // await settingStore.getAllSettlor()
        }
        loadRequests();
    }, []);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // State to track which user is being edited or deleted
    const [editUser, setEditUser] = useState<IDra | null>(null);
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    // Toggle action menu
    const toggleMenu = useCallback(
        (userId: string) => {
            setActiveMenu(activeMenu === userId ? null : userId);
        },
        [activeMenu],
    );

    // Handle edit account
    const handleEdit = useCallback((user: IDra | null = null) => {
        setEditUser(user);
    }, []);

    // Handle delete account
    const handleDelete = useCallback((userId: string | null = null) => {
        setDeleteUserId(userId);
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
                id: "name",
                header: "Team member Name",
                accessorKey: "name",
                cell: ({ row }: { row: { original: IDra } }) => {
                    const fullName = `${row.original.firstName} ${row.original.lastName}`;
                    return <span>{fullName}</span>;
                },
            },
            {
                id: "email",
                header: "Email",
                accessorKey: "email",
            },
            {
                id: "role",
                header: "Account type",
                accessorKey: "role",
                cell: ({ row }: { row: { original: IDra } }) => {
                    const role = row.original.role;
                    return (
                        <span
                            className={`
              px-3 py-1 rounded-full
              ${role === "SUPER ADMIN"
                                    ? "bg-light-green text-dark-green-1"
                                    : "bg-light-orange text-dark-orange"
                                }
              `}
                        >
                            {role}
                        </span>
                    );
                },
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }: { row: { original: IDra } }) => {
                    const user = row.original;

                    return (
                        <div className="relative">
                            <button
                                data-menu-trigger={user?.userId}
                                className="px-3 text-gray-5 hover:text-gray-7 cursor-pointer"
                                onClick={() => toggleMenu(user?.userId)}
                                aria-label="More options"
                            >
                                •••
                            </button>
                            <ActiveMenu
                                userId={user?.userId}
                                activeMenu={activeMenu}
                                menuRef={menuRef}
                                handleEdit={() => handleEdit(user)}
                                handleDelete={() => handleDelete(user?.userId)}
                            />
                        </div>
                    );
                },
            },
        ],
        [activeMenu, toggleMenu, handleEdit, handleDelete],
    );

    const tableHead = ["Team Member Name", "Email", "Account Type", "action"];

    return (
        <div className="mt-10 bg-white p-4 rounded-2xl border border-gray-8 ">
            <section className="mb-4 flex items-center justify-end gap-x-3">
                <button className=" shadow-sm border border-gray-10 px-3 py-2  rounded-xl flex items-center gap-x-2">
                    <img src={filterIcon} alt="filter admin table" />
                    <span className="font-medium text-sm  text-[#525866]">Filter</span>
                </button>

                <button className="shadow-sm border border-gray-10 px-3 py-2  rounded-xl flex items-center gap-x-2">
                    <img src={sortIcon} alt="filter admin table" />
                    <span className="font-medium text-sm  text-[#525866]">Sort</span>
                    <img src={caretDownIcon} alt="filter admin table" />
                </button>
            </section>

            <>
                {settingStore.isLoading ? (
                    <LoadingTable headArr={tableHead} />
                ) : settingStore.allDra.size > 0 ? (
                    <Table
                        columns={columns}
                        data={[...settingStore.allDra.values()].map((user, i: number) => ({
                            ...user, id: i.toString()
                        } as IDra))
                        }
                        count={settingStore.allDra.size}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                    />
                ) : (
                    <EmptyTable
                        headArr={tableHead}
                        heading="No Admin data available."
                        text="Create admin to get started!"
                    />
                )}
            </>

            {/* Modals */}
            {editUser && (
                <Modal
                    body={
                        <EditDRA
                            user={editUser}
                            close={() => handleEdit(null)}
                            settingStore={settingStore}
                            trustStore={trustStore}
                        />}
                />
            )}

            {deleteUserId && (
                <Modal
                    body={
                        <DeleteDRA
                            from="Admin"
                            userId={deleteUserId}
                            close={() => handleDelete(null)}
                            store={settingStore}
                        />
                    }
                />
            )}
        </div>
    );
});