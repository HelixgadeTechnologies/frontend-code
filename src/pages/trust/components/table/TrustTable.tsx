import { useState, useRef, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Modal,
  EmptyTable,
  LoadingTable,
  ActiveMenu,
} from "../../../../components/elements";
import { RowSelectionState } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { trustStore as TrustStore } from "../../../trust/store/trustStore";
import { ITrustList } from "../../types/interface";
import { settingStore as SettingStore } from "../../../Settings/store/settingStore";
import { DeleteTrust } from "../forms/DeleteTrust";
import { trustEstablishmentStore as TrustEstablishmentStore } from "../../../trustEstablishment/store/trustEstablishmentStore";
import { authStore as AuthStore } from "../../../auth/store/authStore";

const settingStoreCTX = createContext(SettingStore);
const TrustStoreCtx = createContext(TrustStore);
const authStoreCtx = createContext(AuthStore);
const TrustEstablishmentStoreCtx = createContext(TrustEstablishmentStore);
const TrustTable = observer(() => {
  const trustStore = useContext(TrustStoreCtx);
  const settingStore = useContext(settingStoreCTX);
  const trustEstablishmentStore = useContext(TrustEstablishmentStoreCtx);
  const authStore = useContext(authStoreCtx);
  // State to manage row selection and active menu
  // Using useState to manage row selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // State to track which user is being edited or deleted
  const [deleteTrustId, setDeleteTrustId] = useState<string | null>(null);

  useEffect(() => {
    async function loadRequests() {
      await trustStore.getAllTrust();
      await settingStore.getAllSettlor()
    }
    loadRequests();
  }, []);

  // Toggle action menu
  const toggleMenu = useCallback(
    (trustId: string) => {
      setActiveMenu(activeMenu === trustId ? null : trustId);
    },
    [activeMenu],
  );

  // Handle delete account
  const handleDelete = useCallback((trustId: string | null = null) => {
    setDeleteTrustId(trustId);
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

  const switchPage = useCallback((trustId: string) => {
    async function loadRequests() {
      await trustStore.getSingleTrust(trustId)
      trustStore.pageSwitched = 3;
    }
    loadRequests();
  }, [trustStore]);

  const trustAction = useCallback((trustId: string) => {
    async function loadRequests() {
      trustStore.selectedTrustId = trustId; // Set selected trust ID in the store
      sessionStorage.setItem("selectedTrustId", trustId); // Store selected trust ID in sessionStorage
      trustEstablishmentStore.selectedYear = 0;
      await trustEstablishmentStore.getSingleTrustEstablishmentStatus(trustId)
    }
    loadRequests();
  }, [trustEstablishmentStore]);

  // Define columns with memoization
  const columns = useMemo(
    () => [
      {
        id: "trustName",
        header: "Trust",
        accessorKey: "trustName",
        cell: ({ row }: { row: { original: ITrustList } }) => {
          const trust = row.original;
          const trustName = `${trust.trustName}`;
          const formattedName = trustName.toLowerCase().replace(/\s+/g, "-");
          return (
            <Link
              className="hover:underline"
              to={`/trust/${formattedName}/${trust.trustId}`}
              onClick={async (e) => {
                e.stopPropagation(); // Prevent row click event
                trustAction(trust.trustId)
              }}
            >
              {trustName}
            </Link>
          );
        },
      },
      {
        id: "country",
        header: "Country",
        accessorKey: "country",
      },
      {
        id: "communities",
        header: "Community",
        accessorKey: "trustCommunities",
        cell: ({ row }: { row: { original: ITrustList } }) => {
          const communities = row.original.trustCommunities;
          return (
            <span>
              {communities}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: { original: ITrustList } }) => {
          const trust = row.original;

          return (
            <div className="relative">
              <button
                data-menu-trigger={trust?.trustId}
                className="px-3 text-gray-5 hover:text-gray-7 cursor-pointer"
                onClick={() => toggleMenu(trust?.trustId)}
                aria-label="More options"
              >
                •••
              </button>
              <ActiveMenu
                userId={trust?.trustId}
                activeMenu={activeMenu}
                menuRef={menuRef}
                handleEdit={() => switchPage(trust?.trustId)}
                handleDelete={() => handleDelete(trust?.trustId)}
              />
            </div>
          );
        },
      },
    ],
    [activeMenu, toggleMenu, handleDelete],
  );

  const tableHead = ["Trust", "country", "Communities", "action"];

  return (
    <div className="mt-10 bg-white p-4 rounded-2xl border border-gray-8 ">
      <>
        {trustStore.isLoading ? (
          <LoadingTable headArr={tableHead} />
        ) : trustStore.allTrust.size > 0 ? (
          <Table
            columns={columns}
            data={(authStore.user.role == "DRA"?[...trustStore.allTrust.values()].filter(e=> e.trustId == authStore.user?.trusts!):[...trustStore.allTrust.values()]).map((trust: ITrustList, i: number) => ({
              ...trust, id: i.toString()
            } as ITrustList))
            }
            count={trustStore.allTrust.size}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        ) : (
          <EmptyTable
            headArr={tableHead}
            heading="No Trust data available."
            text="Create trust to get started!"
          />
        )}
      </>
      {/* Modals */}

      {deleteTrustId && (
        <Modal
          body={
            <DeleteTrust
              close={() => handleDelete(null)}
              trustId={deleteTrustId}
              store={trustStore}
            />
          }
        />
      )}
    </div>
  );
});

export default TrustTable;
