import { useState } from "react";

import { Modal } from "../../../components/elements";
import { AddDRA, DRATable } from "../../../components/sections/settings/dra";

import { addCircleIcon, chatBlueIcon, timerIcon } from "../../../assets/icons";
import { PageHeader, RoutedTabs } from "../../../components/layouts";

const ManageDRA = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add DRA"
        desc="Check and filter all your medical appointments here"
        ctaText="New DRA"
        action={() => setOpenModal(true)}
        iconLeft={<img src={addCircleIcon} alt="add dra" />}
      />

      <section className="mt-5 flex items-center gap-x-3">
        <div className=" w-fit bg-primary-200/40 flex items-center gap-x-2 p-3 rounded-lg border border-primary-200">
          <img src={chatBlueIcon} alt="approved dra" />
          <span className="font-medium text-sm text-black">Approved DRA </span>
          <span className="px-2 py-1 bg-primary-200 rounded-3xl text-white font-medium text-xs">
            0{" "}
          </span>
        </div>

        <div className=" w-fit bg-off-white-2 flex items-center gap-x-2 p-3 rounded-lg border border-gray-1">
          <img src={timerIcon} alt="pending dra" />
          <span className="font-medium text-sm text-black">Pending DRA </span>
          <span className="px-2 py-1 bg-gray-5 rounded-3xl text-black font-medium text-xs">
            0{" "}
          </span>
        </div>
      </section>

      <div className="mt-14">
        <RoutedTabs />

        <section>
          <DRATable />
        </section>
      </div>

      {openModal && (
        <Modal
          body={<AddDRA close={() => setOpenModal(false)} />}
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default ManageDRA;
