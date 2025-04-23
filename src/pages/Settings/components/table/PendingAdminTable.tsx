import { RowSelectionState } from "@tanstack/react-table";
import { Observer, observer } from "mobx-react-lite";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { caretDownIcon, filterIcon, sortIcon, crossIcon, checkIcon } from "../../../../assets/icons";
import { EmptyTable, LoadingTable, Modal, Table } from "../../../../components/elements";
import { settingStore as SettingStore } from "../../store/settingStore"
import { trustStore as TrustStore } from "../../../trust/store/trustStore";
import { CreateAdminPayload, IAdmin, IAdminPayloadData } from "../../types/interface";
import { DeleteAdmin } from "../form/DeleteAdmin";
import { EditAdmin } from "../form/EditAdmin";
import Tag from "../../../../components/elements/Tag";
import { toast } from "react-toastify";


const SettingsStoreCtx = createContext(SettingStore);
const TrustStoreCtx = createContext(TrustStore);

export const PendingAdminTable = observer(() => {
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

    // State to track which user is being deleted
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    // Toggle action menu
    const toggleMenu = useCallback(
        (userId: string) => {
            setActiveMenu(activeMenu === userId ? null : userId);
        },
        [activeMenu],
    );

    const handleApprove = useCallback(async (user: IAdmin) => {
        console.log(`Approved user : ${user}`);
        settingStore.selectedUserId = user.userId
        try {
            const formData: IAdminPayloadData = {
                email: user.email as string,
                firstName: user.firstName as string,
                lastName: user.lastName as string,
                roleId: user.roleId as string,
                trusts: user.trusts as string,
                userId: user.userId,
                status: 1,
                phoneNumber: user.phoneNumber as string,
            }
            const payload: CreateAdminPayload = {
                isCreate: false,
                data: formData
            };
            const response = await settingStore.approvePendingAdmin(payload)

            if (response) {
                await settingStore.getAllAdmin();
                settingStore.isUpdated = true;
                toast.success("Admin approval successful.");
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
        // Add your logic here
    }, []);

    const handleReject = useCallback((userId: string) => {
        setDeleteUserId(userId);
        // Add your logic here
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
                        <Observer>
                            {() => (
                                <div className="flex gap-2">
                                    <Tag
                                        label={settingStore.isApproving ? "Approving.." : "Approve"}
                                        type="approve"
                                        icon={checkIcon}
                                        onClick={() => handleApprove(user)} // Add your approve handler
                                    />
                                    <Tag
                                        label="Reject"
                                        type="reject"
                                        icon={crossIcon}
                                        onClick={() => handleReject(user.userId)} // Add your reject handler
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
                ) : settingStore.allAdmin.size > 0 ? (
                    <Table
                        columns={columns}
                        data={[...settingStore.allPendingAdmin.values()].map((user, i: number) => ({
                            ...user, id: i.toString()
                        } as IAdmin))
                        }
                        count={settingStore.allAdmin.size}
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
            {deleteUserId && (
                <Modal
                    body={
                        <DeleteAdmin
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