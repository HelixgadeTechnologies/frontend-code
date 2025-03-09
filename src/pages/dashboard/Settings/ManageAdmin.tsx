import { useState } from "react";

import { Modal } from "../../../components/elements";
import { AdminTable, AddAdmin } from "../../../components/sections/settings";
import { PageHeader, RoutedTabs } from "../../../components/layouts";
import { addCircleIcon, chatBlueIcon, timerIcon } from "../../../assets/icons";

const ManageAdmin = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add Admin"
        desc="All Admins added will be displayed here"
        ctaText="Add  Admin"
        iconLeft={<img src={addCircleIcon} alt="add admin" />}
        action={() => setOpenModal(true)}
      />

      <section className="mt-5 flex items-center gap-x-3">
        <div className=" w-fit bg-primary-200/40 flex items-center gap-x-2 p-3 rounded-lg border border-primary-200">
          <img src={chatBlueIcon} alt="approved admin" />
          <span className="font-medium text-sm text-black">
            Approved Admin{" "}
          </span>
          <span className="px-2 py-1 bg-primary-200 rounded-3xl text-white font-medium text-xs">
            0{" "}
          </span>
        </div>

        <div className=" w-fit bg-off-white-2 flex items-center gap-x-2 p-3 rounded-lg border border-gray-1">
          <img src={timerIcon} alt="pending admin" />
          <span className="font-medium text-sm text-black">Pending Admin </span>
          <span className="px-2 py-1 bg-gray-5 rounded-3xl text-black font-medium text-xs">
            0{" "}
          </span>
        </div>
      </section>

      <div className="mt-14">
        <RoutedTabs />

        <section>
          <AdminTable />
        </section>
      </div>

      {openModal && (
        <Modal
          body={<AddAdmin close={() => setOpenModal(false)} />}
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default ManageAdmin;
