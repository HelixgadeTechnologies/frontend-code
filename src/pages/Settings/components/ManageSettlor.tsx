import { createContext, useContext, useState } from "react";

import { Modal } from "../../../components/elements";

import { PageHeader, RoutedTabs } from "../../../components/layouts";
import { addCircleIcon } from "../../../assets/icons";
import { SettlorsTable } from "./table/SettlorsTable";
import { AddSettlor } from "./form/AddSettlor";
import { observer } from "mobx-react-lite";
import { settingStore as SettingStore } from "../store/settingStore";
import { UpdateSuccess } from "./modal/UpdateSuccess";

const SettingsStoreCtx = createContext(SettingStore);
const ManageSettlor = observer(() => {
  const settingStore = useContext(SettingsStoreCtx);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add Settlors"
        desc="All Settlor will be displayed here"
        ctaText="New Settlor"
        action={() => setOpenModal(true)}
        iconLeft={<img src={addCircleIcon} alt="add settlor" />}
      />

      <div className="mt-14">
        <RoutedTabs />

        <section>
          <SettlorsTable />
        </section>
      </div>

      {openModal && (
        <Modal
          body={
            <AddSettlor
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

export default ManageSettlor;
