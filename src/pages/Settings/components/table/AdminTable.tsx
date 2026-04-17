import { RowSelectionState } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import ActiveMenu from "../../../../components/elements/ActiveMenu";
import { caretDownIcon, filterIcon, sortIcon } from "../../../../assets/icons";
import { EmptyTable, LoadingTable, Modal, Table } from "../../../../components/elements";
import { settingStore as SettingStore } from "../../store/settingStore"
// import { authStore as AuthStore } from "../../../auth/store/authStore"
import { trustStore as TrustStore } from "../../../trust/store/trustStore";
import { IAdmin } from "../../types/interface";
import { DeleteAdmin } from "../form/DeleteAdmin";
import { EditAdmin } from "../form/EditAdmin";


const SettingsStoreCtx = createContext(SettingStore);
// const AuthStoreCtx = createContext(AuthStore);
const TrustStoreCtx = createContext(TrustStore);

export const AdminTable = observer(() => {

    // const authStore = useContext(AuthStoreCtx);
    const settingStore = useContext(SettingsStoreCtx);
    const trustStore = useContext(TrustStoreCtx);

    useEffect(() => {
        async function loadRequests() {
            await settingStore.getAllAdmin()
            await settingStore.getRole();
            await trustStore.getAllTrust();
            // await settingStore.getAllDra()
            // await settingStore.getAllNUPRC()
            // await settingStore.getAllSettlor()
        }
        loadRequests();
    }, []);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // State to track which user is being edited or deleted
    const [editUser, setEditUser] = useState<IAdmin | null>(null);
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    // Toggle action menu
    const [searchTerm, setSearchTerm] = useState("");

    const toggleMenu = useCallback(
        (userId: string) => {
            setActiveMenu(activeMenu === userId ? null : userId);
        },
        [activeMenu],
    );

    // Handle edit account
    const handleEdit = useCallback((user: IAdmin | null = null) => {
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
                cell: ({ row }: { row: { original: IAdmin } }) => {
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
                cell: ({ row }: { row: { original: IAdmin } }) => {
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
                cell: ({ row }: { row: { original: IAdmin } }) => {
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

    const filteredData = useMemo(() => {
        const admins = [...settingStore.allAdmin.values()];
        if (!searchTerm) return admins;
        
        return admins.filter((user) => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const email = user?.email?.toLowerCase();
            const search = searchTerm.toLowerCase();
            return fullName.includes(search) || email?.includes(search);
        });
    }, [settingStore.allAdmin, searchTerm]);

    return (
        <div className="mt-10 bg-white p-4 rounded-2xl border border-gray-8 ">
            <section className="mb-4 flex items-center justify-between gap-x-3">
                <div className="flex-1 max-w-sm">
                    <input
                        type="text"
                        placeholder="Search team members..."
                        className="w-full bg-white border border-gray-10 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-x-3">
                    <button className=" shadow-sm border border-gray-10 px-3 py-2  rounded-xl flex items-center gap-x-2">
                        <img src={filterIcon} alt="filter admin table" />
                        <span className="font-medium text-sm  text-[#525866]">Filter</span>
                    </button>

                    <button className="shadow-sm border border-gray-10 px-3 py-2  rounded-xl flex items-center gap-x-2">
                        <img src={sortIcon} alt="filter admin table" />
                        <span className="font-medium text-sm  text-[#525866]">Sort</span>
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
                        data={filteredData.map((user, i: number) => ({
                            ...user, id: i.toString()
                        } as IAdmin))
                        }
                        count={filteredData.length}
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
                        <EditAdmin
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
                        <DeleteAdmin
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