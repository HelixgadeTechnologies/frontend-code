import { createContext, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import ConflictDashboard from "./chart/ConflictDashboard";
import { conflictStore as ConflictStore } from "../store/conflictStore"
import { projectStore as ProjectStore } from "../../project/store/projectStore"
import { trustStore as TrustStore } from "../../trust/store/trustStore"
import { ConflictTable } from "./table/ConflictTable";
import ConflictForm from "./form/ConflictForm";
import { DashboardSkeleton, Modal } from "../../../components/elements";

const conflictStoreCtx = createContext(ConflictStore);
const projectStoreCtx = createContext(ProjectStore);
const trustStoreCtx = createContext(TrustStore);
const ConflictResolution = observer(() => {
  const conflictStore = useContext(conflictStoreCtx);
  const projectStore = useContext(projectStoreCtx);
  const trustStore = useContext(trustStoreCtx);


  useEffect(() => {
    async function fetchData() {
      let selectedTrustId = window.sessionStorage.getItem("selectedTrustId");
      await conflictStore.getConflictDashboardByTrustId(selectedTrustId as string)
      await conflictStore.getConflicts(selectedTrustId as string)
      await projectStore.getProjects(selectedTrustId as string)
      await conflictStore.getCauseOfConflict()
      await conflictStore.getConflictStatus()
      await conflictStore.getCourtLitigation()
      await conflictStore.getIssuesAddressedBy()
      await conflictStore.getPartiesInvolve()
    }
    fetchData();
  }, [conflictStore, projectStore]);

  return (
    <>
      {conflictStore.conflictBaseView == 1 && (
        conflictStore.isDashboardLoading ? (
          <DashboardSkeleton />
        ) :
          (
            <ConflictDashboard />
          )
      )}
      {conflictStore.conflictBaseView == 2 && (
        <ConflictTable />
      )}
    
      {/* Modals */}
      {conflictStore.isReportDialogVisible && (
        <Modal
        body={
            <ConflictForm
              conflictStore={conflictStore}
              projectStore={projectStore}
              selectedTrust={trustStore.selectedTrustId as string}
              close={() => conflictStore.isReportDialogVisible = false}
            />
          }
          close={() => conflictStore.isReportDialogVisible = false}
        />
      )}
    </>
  );
});

export default ConflictResolution;
