import { createContext, useContext } from "react";
import { Modal } from "../../../components/elements";
import { PageHeader } from "../../../components/layouts";
import { addCircleIcon } from "../../../assets/icons";
import { observer } from "mobx-react-lite";
import { settingStore as SettingStore } from "../store/settingStore"
import { trustStore as TrustStore } from "../../trust/store/trustStore";
import { AdminTable } from "./table/AdminTable";
import { AddAdmin } from "./form/AddAdmin";
import { UpdateSuccess } from "./modal/UpdateSuccess";
import { PendingAdminTable } from "./table/PendingAdminTable";
import PageSwitch from "./PageSwitch";


const SettingsStoreCtx = createContext(SettingStore);
const TrustStoreCtx = createContext(TrustStore);
const ManageAdmin = observer(() => {

  const settingStore = useContext(SettingsStoreCtx);
  const trustStore = useContext(TrustStoreCtx);

  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add Admin"
        desc="All Admins added will be displayed here"
        ctaText="Add  Admin"
        iconLeft={<img src={addCircleIcon} alt="add admin" />}
        action={() => settingStore.openModal = true}
      />

      <PageSwitch
        type="Admin"
        approvedCount={settingStore.allAdmin.size}
        pendingCount={settingStore.allPendingAdmin.size}
        renderApprovedTable={() => <AdminTable />}
        renderPendingTable={() => <PendingAdminTable />}
      />

      {settingStore.openModal && (
        <Modal
          body={
            <AddAdmin
              close={() => settingStore.openModal = false}
              settingStore={settingStore}

              trustStore={trustStore}
            />}
          close={() => settingStore.openModal = false}
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

export default ManageAdmin;
