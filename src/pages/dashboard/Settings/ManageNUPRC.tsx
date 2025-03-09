import { useState } from "react";

import { Modal } from "../../../components/elements";

import { PageHeader, RoutedTabs } from "../../../components/layouts";
import {
  AddNuprc,
  NuprcTable,
} from "../../../components/sections/settings/Nuprc";
import { addCircleIcon } from "../../../assets/icons";

const ManageNUPRC = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add NUPRC-ADR"
        desc="Check and filter all your medical appointments here"
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
          body={<AddNuprc close={() => setOpenModal(false)} />}
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default ManageNUPRC;
