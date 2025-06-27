import { createContext, useContext, useState } from "react";
import { Modal } from "../../../components/elements";
import { PageHeader, RoutedTabs } from "../../../components/layouts";
import { AddNuprc } from "./form/AddNuprc";
import { observer } from "mobx-react-lite";
import { settingStore as SettingStore } from "../store/settingStore"
import { addCircleIcon } from "../../../assets/icons";
import { NuprcTable } from "./table/NuprcTable";
import { UpdateSuccess } from "./modal/UpdateSuccess";

const SettingsStoreCtx = createContext(SettingStore);
const ManageNUPRC = observer(() => {
  const settingStore = useContext(SettingsStoreCtx);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add NUPRC-ADR"
        desc="All NUPRC will be displayed here"
        ctaText="New NUPRC-ADR"
        action={() => setOpenModal(true)}
        iconLeft={<img src={addCircleIcon} alt="add dra" />}
      />

      <div className="mt-14">
        <RoutedTabs />

        <section>
          <NuprcTable />
        </section>
      </div>

      {openModal && (
        <Modal
          body={
            <AddNuprc
              close={() => setOpenModal(false)}
              settingStore={settingStore}
            />}
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

export default ManageNUPRC;
