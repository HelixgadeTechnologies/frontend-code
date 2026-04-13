import { createContext, useContext, useEffect, useState } from "react";
import { Modal } from "../../../components/elements";
import { addCircleIcon, } from "../../../assets/icons";
import { PageHeader } from "../../../components/layouts";
import { observer } from "mobx-react-lite";
import { settingStore as SettingStore } from "../store/settingStore"
import { trustStore as TrustStore } from "../../trust/store/trustStore";
import AdminSwitch from "./PageSwitch";
import { CommitteeTable } from "./table/CommitteeTable";
import { PendingCommitteeTable } from "./table/PendingCommitteeTable";
import { AddCommitteeMember } from "./form/AddCommitteeMember";
import { UpdateSuccess } from "./modal/UpdateSuccess";
import { IDra } from "../types/interface";

const SettingsStoreCtx = createContext(SettingStore);
const TrustStoreCtx = createContext(TrustStore);

interface ManageCommitteeProps {
    type: "DRA" | "BoT" | "MC" | "AC";
    roleName: string;
}

export const ManageCommittee = observer(({ type, roleName }: ManageCommitteeProps) => {

  const settingStore = useContext(SettingsStoreCtx);
  const trustStore = useContext(TrustStoreCtx);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    switch (type) {
      case "DRA":
        settingStore.getAllDra();
        break;
      case "BoT":
        settingStore.getAllBoT();
        break;
      case "MC":
        settingStore.getAllMC();
        break;
      case "AC":
        settingStore.getAllAC();
        break;
      default:
        break;
    }
    settingStore.getRole();
  }, [settingStore, type]);

  const getApprovedData = (): IDra[] => {
    switch (type) {
      case "DRA": return [...settingStore.allDra.values()];
      case "BoT": return [...settingStore.allBoT.values()];
      case "MC": return [...settingStore.allMC.values()];
      case "AC": return [...settingStore.allAC.values()];
      default: return [];
    }
  };

  const getPendingData = (): IDra[] => {
    switch (type) {
      case "DRA": return [...settingStore.allPendingDra.values()];
      case "BoT": return [...settingStore.allPendingBoT.values()];
      case "MC": return [...settingStore.allPendingMC.values()];
      case "AC": return [...settingStore.allPendingAC.values()];
      default: return [];
    }
  };

  return (
    <div className="px-10 py-11">
      <PageHeader
        title={`Add ${type}`}
        desc={`All ${type} will be displayed here`}
        ctaText={`New ${type}`}
        action={() => setOpenModal(true)}
        iconLeft={<img src={addCircleIcon} alt={`add ${type}`} />}
      />

      <AdminSwitch
        type={type}
        approvedCount={getApprovedData().length}
        pendingCount={getPendingData().length}
        renderApprovedTable={() => <CommitteeTable data={getApprovedData()} type={type} />}
        renderPendingTable={() => <PendingCommitteeTable data={getPendingData()} type={type} />}
      />

      {openModal && (
        <Modal
          body={
            <AddCommitteeMember
              roleName={roleName}
              close={() => setOpenModal(false)}
              settingStore={settingStore}
              trustStore={trustStore}
            />
          }
          close={() => setOpenModal(false)}
        />
      )}

      {settingStore.isUpdated && (
        <Modal
          body={
            <UpdateSuccess
              close={() => settingStore.isUpdated = false}
            />}
          close={() => settingStore.isUpdated = false}
        />
      )}
    </div>
  );
});

export default ManageCommittee;
