import { PageHeader, RoutedTabs } from "../../../components/layouts";

const ManageAdmin = () => {
  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add Admin"
        desc="All Admins added will be displayed here"
        ctaText="Add  Admin"
      />

      <div className="mt-14">
        <RoutedTabs />
        Page
      </div>
    </div>
  );
};

export default ManageAdmin;
