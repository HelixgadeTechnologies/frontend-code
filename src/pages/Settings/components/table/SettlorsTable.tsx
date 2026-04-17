import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { caretDownIcon, filterIcon, sortIcon } from "../../../../assets/icons";
import { EmptyTable, LoadingTable, Modal, Table } from "../../../../components/elements";
import { ISettlor } from "../../types/interface";
import { RowSelectionState } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { settingStore as SettingStore } from "../../store/settingStore";
import { EditSettlor } from "../form/EditSettlor";
import { DeleteSettlor } from "../form/DeleteSettlor";

const SettingsStoreCtx = createContext(SettingStore);

export const SettlorsTable = observer(() => {
    const settingStore = useContext(SettingsStoreCtx);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // State to track which user is being edited or deleted
    const [editUser, setEditUser] = useState<ISettlor | null>(null);
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    useEffect(() => {
        async function loadRequests() {
            await settingStore.getAllSettlor();
        }
        loadRequests();
    }, [settingStore]);

    // Toggle action menu
    const [searchTerm, setSearchTerm] = useState("");

    const toggleMenu = useCallback(
        (userId: string) => {
            setActiveMenu(activeMenu === userId ? null : userId);
        },
        [activeMenu]
    );

    // Handle edit account
    const handleEdit = useCallback((user: ISettlor | null = null) => {
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
                !(event.target as Element).closest(`[data-menu-trigger="${activeMenu}"]`)
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
                accessorKey: "contactName",
            },
            {
                id: "settlor-name",
                header: "Settlor Name",
                accessorKey: "settlorName",
            },
            {
                id: "email",
                header: "Email",
                accessorKey: "contactEmail",
            },
            {
                id: "Phone",
                header: "Phone Number",
                accessorKey: "contactPhoneNumber",
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }: { row: { original: ISettlor } }) => {
                    const settlor = row.original;
                    return (
                        <div className="relative">
                            <button
                                data-menu-trigger={settlor?.id}
                                className="px-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                                onClick={() => toggleMenu(settlor?.id)}
                                aria-label="More options"
                            >
                                •••
                            </button>
                            {activeMenu === settlor?.id && (
                                <div
                                    ref={menuRef}
                                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50"
                                >
                                    <button
                                        onClick={() => handleEdit(settlor)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Edit account
                                    </button>
                                    <button
                                        onClick={() => handleDelete(settlor?.settlorId)}
                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Delete account
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                },
            },
        ],
        [activeMenu, toggleMenu, handleEdit, handleDelete]
    );

    const tableHead = ["Contact Name", "Settlor Name", "Email", "Phone Number", "action"];

    const filteredData = useMemo(() => {
        const settlors = [...settingStore.allSettlor.values()];
        if (!searchTerm) return settlors;

        return settlors.filter((item) => {
            const contactName = item.contactName?.toLowerCase() || "";
            const settlorName = item.settlorName?.toLowerCase() || "";
            const email = item.contactEmail?.toLowerCase() || "";
            const search = searchTerm.toLowerCase();
            return (
                contactName.includes(search) ||
                settlorName.includes(search) ||
                email.includes(search)
            );
        });
    }, [settingStore.allSettlor, searchTerm]);

    return (
        <div className="mt-10 bg-white p-4 rounded-2xl border border-gray-8">
            <section className="mb-4 flex items-center justify-between gap-x-3">
                <div className="flex-1 max-w-sm">
                    <input
                        type="text"
                        placeholder="Search settlors..."
                        className="w-full bg-white border border-gray-10 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-x-3">
                    <button className="shadow-sm border border-gray-10 px-3 py-2 rounded-xl flex items-center gap-x-2">
                        <img src={filterIcon} alt="filter admin table" />
                        <span className="font-medium text-sm text-[#525866]">Filter</span>
                    </button>

                    <button className="shadow-sm border border-gray-10 px-3 py-2 rounded-xl flex items-center gap-x-2">
                        <img src={sortIcon} alt="filter admin table" />
                        <span className="font-medium text-sm text-[#525866]">Sort</span>
                        <img src={caretDownIcon} alt="filter admin table" />
                    </button>
                </div>
            </section>
            <>
                {settingStore.isLoading ? (
                    <LoadingTable headArr={tableHead} />
                ) : filteredData.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredData.map(
                            (settlor, i: number) =>
                            ({
                                ...settlor,
                                id: i.toString(),
                            } as ISettlor)
                        )}
                        count={filteredData.length}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                    />
                ) : (
                    <EmptyTable
                        headArr={tableHead}
                        heading="No settlor data available."
                        text="Create settlor to get started!"
                    />
                )}
            </>

            {/* Modals */}
            {editUser && (
                <Modal
                    body={
                        <EditSettlor
                            settlor={editUser}
                            close={() => handleEdit(null)}
                            settingStore={settingStore}
                        />
                    }
                />
            )}

            {deleteUserId && (
                <Modal
                    body={
                        <DeleteSettlor
                            settlorId={deleteUserId}
                            close={() => handleDelete(null)}
                            store={settingStore}
                        />
                    }
                />
            )}
        </div>
    );
});