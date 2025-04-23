import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { caretDownIcon, filterIcon, sortIcon } from "../../../../assets/icons";
import { ActiveMenu, EmptyTable, LoadingTable, Modal, Table } from "../../../../components/elements";
import { INuprc } from "../../types/interface";
import { RowSelectionState } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { settingStore as SettingStore } from "../../store/settingStore"
import { EditNuprc } from "../form/EditNuprc";
import { DeleteNuprc } from "../form/DeleteNuprc";

const SettingsStoreCtx = createContext(SettingStore);
export const NuprcTable = observer(() => {
    const settingStore = useContext(SettingsStoreCtx);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // State to track which user is being edited or deleted
    const [editUser, setEditUser] = useState<INuprc | null>(null);
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
    useEffect(() => {
        async function loadRequests() {
            await settingStore.getAllNUPRC()
            // await settingStore.getAllAdmin()
            // await settingStore.getAllSettlor()
        }
        loadRequests();
    }, []);
    // Toggle action menu
    const toggleMenu = useCallback(
        (userId: string) => {
            setActiveMenu(activeMenu === userId ? null : userId);
        },
        [activeMenu],
    );

    // Handle edit account
    const handleEdit = useCallback((user: INuprc | null = null) => {
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

    // Define columns
    const columns = useMemo(
        () => [
            {
                id: "name",
                header: "Contact Name",
                accessorKey: "name",
                cell: ({ row }: { row: { original: INuprc } }) => {
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
                id: "phone",
                header: "Phone Number",
                accessorKey: "phoneNumber",
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }: { row: { original: INuprc } }) => {
                    const user = row.original;

                    return (
                        <div className="relative">
                            <button
                                data-menu-trigger={user?.id}
                                className="px-3 text-gray-5 hover:text-gray-7 cursor-pointer"
                                onClick={() => toggleMenu(user?.id)}
                                aria-label="More options"
                            >
                                •••
                            </button>
                            <ActiveMenu
                                userId={user?.id}
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

    const tableHead = ["Contact Name", "Email", "Phone Number", "action"];

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
                ) : settingStore.allNuprc.size > 0 ? (
                    <Table
                        columns={columns}
                        data={[...settingStore.allNuprc.values()].map((user, i: number) => ({
                            ...user, id: i.toString()
                        } as INuprc))
                        }
                        count={settingStore.allNuprc.size}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                    />
                ) : (
                    <EmptyTable
                        headArr={tableHead}
                        heading="No NUPRC data available."
                        text="Create NUPRC to get started!"
                    />
                )}
            </>

            {/* Modals */}
            {editUser && (
                <Modal
                    body={
                        <EditNuprc
                            user={editUser}
                            close={() => handleEdit(null)}
                            settingStore={settingStore}
                        />}
                />
            )}

            {deleteUserId && (
                <Modal
                    body={
                        <DeleteNuprc
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