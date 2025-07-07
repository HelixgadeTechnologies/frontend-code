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
    ],
    [],
  );

  const tableHead = ["Trust", "country", "Communities", "action"];

  return (
    <div className="mt-10  p-4   ">
      <div className="mt-10 mb-4  p-4  ">
        <div className="mb-4">
          <h2 className="font-semibold text-xl text-gray-900">All Trust</h2>
          <p className="text-gray-500 text-sm">Select a Trust to view the project assigned to it.</p>
        </div>
      </div>
      <>
        {trustStore.isLoading ? (
          <LoadingTable headArr={tableHead} />
        ) : trustStore.allTrust.size > 0 ? (
          <Table
            columns={columns}
            data={[...trustStore.allTrust.values()].map((trust: ITrustList, i: number) => ({
              ...trust, id: i.toString()
            } as ITrustList))
            }
            count={trustStore.allTrust.size}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            totalPage={trustStore.allTrust.size}
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
