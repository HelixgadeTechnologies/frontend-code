import { RowSelectionState } from "@tanstack/react-table";
import { Observer, observer } from "mobx-react-lite";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { caretDownIcon, filterIcon, sortIcon, crossIcon, checkIcon } from "../../../../assets/icons";
import { EmptyTable, LoadingTable, Modal, Table, Tag } from "../../../../components/elements";
import { settingStore as SettingStore } from "../../store/settingStore"
//import { trustStore as TrustStore } from "../../../trust/store/trustStore";
import { toast } from "react-toastify";
import { DeleteDRA } from "../form/DeleteDRA";
import { createDraPayload, IDra, IDraPayloadData } from "../../types/interface";


const SettingsStoreCtx = createContext(SettingStore);
//const TrustStoreCtx = createContext(TrustStore);

interface PendingCommitteeTableProps {
    data: IDra[];
    type: string;
}

export const PendingCommitteeTable = observer(({ data, type }: PendingCommitteeTableProps) => {
    const settingStore = useContext(SettingsStoreCtx);
    //const trustStore = useContext(TrustStoreCtx);

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");

    const toggleMenu = useCallback(
        (userId: string) => {
            setActiveMenu(activeMenu === userId ? null : userId);
        },
        [activeMenu],
    );

    const handleApprove = useCallback(async (user: IDra) => {
        settingStore.selectedUserId = user.userId
        try {
            const formData: IDraPayloadData = {
                email: user.email as string,
                firstName: user.firstName as string,
                lastName: user.lastName as string,
                trusts: user.trusts as string,
                userId: user.userId,
                status: 1,
                phoneNumber: user.phoneNumber as string,
                roleId: user.roleId as string
            }
            const payload: createDraPayload = {
                isCreate: false,
                data: formData
            };
            const response = await settingStore.approvePendingDra(payload)

            if (response) {
                if (type === "DRA") await settingStore.getAllDra();
                else if (type === "BoT") await settingStore.getAllBoT();
                else if (type === "MC") await settingStore.getAllMC();
                else if (type === "AC") await settingStore.getAllAC();
                
                settingStore.isUpdated = true;
            }
        } catch (error: any) {
            settingStore.isUpdated = false;
            const message = error?.response?.body?.message;
            const message2 = error?.response?.body?.error;
            if (message?.includes("Please try again. Database connection failed.")) {
                toast.info(message);
            } else {
                toast.error(message2);
            }
        }
    }, []);

    const handleReject = useCallback((userId: string) => {
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
                        <Observer>
                            {() => (
                                <div className="flex gap-2">
                                    <Tag
                                        label={settingStore.isApproving ? "Approving.." : "Approve"}
                                        type="approve"
                                        icon={checkIcon}
                                        onClick={() => handleApprove(user)}
                                    />
                                    <Tag
                                        label="Reject"
                                        type="reject"
                                        icon={crossIcon}
                                        onClick={() => handleReject(user.userId)}
                                    />
                                </div>
                            )}
                        </Observer>
                    );
                },
            },
        ],
        [activeMenu, toggleMenu, handleApprove, handleReject],
    );

    const tableHead = ["Team Member Name", "Email", "Account Type", "action"];

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter((user) => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const email = user?.email?.toLowerCase();
            const search = searchTerm.toLowerCase();
            return fullName.includes(search) || email?.includes(search);
        });
    }, [data, searchTerm]);

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
                        } as IDra))
                        }
                        count={filteredData.length}
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
            {deleteUserId && (
                <Modal
                    body={
                        <DeleteDRA
                            from={"pending"}
                            userId={deleteUserId}
                            close={() => setDeleteUserId(null)}
                            store={settingStore}
                        />
                    }
                />
            )}
        </div>
    );
});
