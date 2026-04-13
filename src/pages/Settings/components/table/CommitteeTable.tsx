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

interface CommitteeTableProps {
    data: IDra[];
    type: string;
}

export const CommitteeTable = observer(({ data, type }: CommitteeTableProps) => {
    const settingStore = useContext(SettingsStoreCtx);
    const trustStore = useContext(TrustStoreCtx);

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [editUser, setEditUser] = useState<IDra | null>(null);
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    const toggleMenu = useCallback(
        (userId: string) => {
            setActiveMenu(activeMenu === userId ? null : userId);
        },
        [activeMenu],
    );

    const handleEdit = useCallback((user: IDra | null = null) => {
        setEditUser(user);
    }, []);

    const handleDelete = useCallback((userId: string | null = null) => {
        setDeleteUserId(userId);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
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
                ) : data.length > 0 ? (
                    <Table
                        columns={columns}
                        data={data.map((user, i: number) => ({
                            ...user, id: i.toString()
                        } as IDra))
                        }
                        count={data.length}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                    />
                ) : (
                    <EmptyTable
                        headArr={tableHead}
                        heading={`No ${type} data available.`}
                        text={`Create ${type} to get started!`}
                    />
                )}
            </>

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
