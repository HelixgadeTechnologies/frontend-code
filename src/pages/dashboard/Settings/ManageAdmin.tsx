import { useState } from "react";

import { Modal } from "../../../components/elements";
import { AdminTable, AddAdmin } from "../../../components/sections/manageAdmin";
import { PageHeader, RoutedTabs } from "../../../components/layouts";

const ManageAdmin = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add Admin"
        desc="All Admins added will be displayed here"
        ctaText="Add  Admin"
        action={() => setOpenModal(true)}
      />

      <section></section>

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
