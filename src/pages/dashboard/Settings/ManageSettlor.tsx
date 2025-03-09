import { useState } from "react";

import { Modal } from "../../../components/elements";

import { PageHeader, RoutedTabs } from "../../../components/layouts";

import {
  SettlorsTable,
  AddSettlor,
} from "../../../components/sections/settings/Settlor";

import { addCircleIcon } from "../../../assets/icons";

const ManageSettlor = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add Settlors"
        desc="Check and filter all your medical appointments here"
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
          body={<AddSettlor close={() => setOpenModal(false)} />}
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default ManageSettlor;
