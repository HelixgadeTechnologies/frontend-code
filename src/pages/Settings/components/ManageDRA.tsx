import { createContext, useContext, useState } from "react";
import { Modal } from "../../../components/elements";
import { addCircleIcon, } from "../../../assets/icons";
import { PageHeader } from "../../../components/layouts";
import { observer } from "mobx-react-lite";
import { settingStore as SettingStore } from "../store/settingStore"
import { trustStore as TrustStore } from "../../trust/store/trustStore";
import AdminSwitch from "./PageSwitch";
import { PendingDraTable } from "./table/PendingDraTable";
import { DRATable } from "./table/DRATable";
import { AddDRA } from "./form/AddDRA";
import { UpdateSuccess } from "./modal/UpdateSuccess";

const SettingsStoreCtx = createContext(SettingStore);
const TrustStoreCtx = createContext(TrustStore);
const ManageDRA = observer(() => {

  const settingStore = useContext(SettingsStoreCtx);
  const trustStore = useContext(TrustStoreCtx);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add DRA"
        desc="All DRA will be displayed here"
        ctaText="New DRA"
        action={() => setOpenModal(true)}
        iconLeft={<img src={addCircleIcon} alt="add dra" />}
      />

      <AdminSwitch
        type="DRA"
        approvedCount={settingStore.allDra.size}
        pendingCount={settingStore.allPendingDra.size}
        renderApprovedTable={() => <DRATable />}
        renderPendingTable={() => <PendingDraTable />}
      />

      {openModal && (
        <Modal
          body={
            <AddDRA
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

export default ManageDRA;
