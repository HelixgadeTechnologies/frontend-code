import { useState, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  EmptyTable,
  LoadingTable,
} from "../../../../components/elements";
import { RowSelectionState } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { trustStore as TrustStore } from "../../store/trustStore";
import { ITrustList } from "../../types/interface";
// import { settingStore as SettingStore } from "../../../Settings/store/settingStore";
// import { DeleteTrust } from "../forms/DeleteTrust";
import { trustEstablishmentStore as TrustEstablishmentStore } from "../../../trustEstablishment/store/trustEstablishmentStore";
// import { authStore as AuthStore } from "../../../auth/store/authStore";
import { projectStore as ProjectStore } from "../../../project/store/projectStore";
import { dashboardStore as DashboardStore } from "../../../dashboard/store/dashboardStore";
import { FiSearch } from "react-icons/fi";


const projectStoreCTX = createContext(ProjectStore);
const dashboardStoreCTX = createContext(DashboardStore);
const TrustStoreCtx = createContext(TrustStore);
// const authStoreCtx = createContext(AuthStore);
const TrustEstablishmentStoreCtx = createContext(TrustEstablishmentStore);
const GeneralTrust = observer(() => {
  const projectStore = useContext(projectStoreCTX);
  const trustStore = useContext(TrustStoreCtx);
  const dashboardStore = useContext(dashboardStoreCTX);
  const trustEstablishmentStore = useContext(TrustEstablishmentStoreCtx);
  // const authStore = useContext(authStoreCtx);
  // State to manage row selection and active menu
  // Using useState to manage row selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    async function loadRequests() {
      await trustStore.getAllTrust();
    }
    loadRequests();
  }, []);

  const trustAction = useCallback((trustId: string) => {
    async function loadRequests() {
      trustStore.selectedTrustIdG = trustId; // Set selected trust ID in the store
      sessionStorage.setItem("selectedTrustIdG", trustId); // Store selected trust ID in sessionStorage
      projectStore.dashboardData = null;
      await projectStore.getProjectDashboardByTrustId(trustId, 0, "ALL", "ALL")
      await trustEstablishmentStore.getFundsDashboardByTrustIdAndYear(trustId, 0)
      trustEstablishmentStore.dashboardData = null;
      await trustEstablishmentStore.getEstablishmentDashboardByTrustId(trustId)
      dashboardStore.selectedTab = 2;
    }
    loadRequests();
  }, [projectStore, trustEstablishmentStore]);

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
          // const formattedName = trustName.toLowerCase().replace(/\s+/g, "-");
          return (
            <Link
              className="hover:underline"
              to={`#`}
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
        id: "state",
        header: "state",
        accessorKey: "state",
      },
      {
        id: "numberOfTrustCommunities",
        header: "Community",
        accessorKey: "numberOfTrustCommunities",
      },
        {
        id: "completionStatus",
        header: "Status",
        accessorKey: "completionStatus",
        cell: ({ row }: { row: { original: ITrustList } }) => {
          const completionStatus = row.original.completionStatus;
          return (
            <span>
              {`${completionStatus}%`}
            </span>
          );
        },
      },
    ],
    [],
  );

  const filteredData = useMemo(() => {
    const allTrusts = [...trustStore.allTrust.values()];
    if (!searchTerm) return allTrusts;

    return allTrusts.filter((trust) =>
      trust.trustName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trust.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trustStore.allTrust.size, searchTerm]);

  // Reset page to 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const tableHead = ["Trust", "country", "Communities", "action"];

  return (
    <div className="mt-10 p-4">
      <div className="mt-10 mb-4 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-xl text-gray-900">All Trust</h2>
          <p className="text-gray-500 text-sm">Select a Trust to view the project assigned to it.</p>
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a Trust..."
            className="pl-10 pr-4 py-2 border border-gray-10 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <>
        {trustStore.isLoading ? (
          <LoadingTable headArr={tableHead} />
        ) : paginatedData.length > 0 ? (
          <Table
            columns={columns}
            data={paginatedData.map((trust: ITrustList, i: number) => ({
              ...trust, id: i.toString()
            } as ITrustList))
            }
            count={filteredData.length}
            pageSize={pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={totalPage}
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

    </div>
  );
});

export default GeneralTrust;
