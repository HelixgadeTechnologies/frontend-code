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

  // useEffect(() => {
  //   async function loadRequests() {
  //     await settingStore.getAllAdmin()
  //     await settingStore.getRole();
  //     await trustStore.getAllTrust();
  //   }
  //   loadRequests();
  // }, []);
  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add Admin"
        desc="All Admins added will be displayed here"
        ctaText="Add  Admin"
        iconLeft={<img src={addCircleIcon} alt="add admin" />}
        action={() => settingStore.openModal = true}
      />

      {/* <section className="mt-5 flex items-center gap-x-3">
        <div className=" w-fit bg-primary-200/40 flex items-center gap-x-2 p-3 rounded-lg border border-primary-200">
          <img src={chatBlueIcon} alt="approved admin" />
          <span className="font-medium text-sm text-black">
            Approved Admin{" "}
          </span>
          <span className="px-2 py-1 bg-primary-200 rounded-3xl text-white font-medium text-xs">
            {settingStore.allAdmin.size}{" "}
          </span>
        </div>

        <div className=" w-fit bg-off-white-2 flex items-center gap-x-2 p-3 rounded-lg border border-gray-1">
          <img src={timerIcon} alt="pending admin" />
          <span className="font-medium text-sm text-black">Pending Admin </span>
          <span className="px-2 py-1 bg-gray-5 rounded-3xl text-black font-medium text-xs">
            {settingStore.allPendingAdmin.size}{" "}
          </span>
        </div>
      </section> */}
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
