import { PageHeader, RoutedTabs } from "../../../components/layouts";

const ManageSettlor = () => {
  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add Settlors"
        desc="Check and filter all your medical appointments here"
        ctaText="New Settlor"
      />

      <div className="mt-14">
        <RoutedTabs />
        Page
      </div>
    </div>
  );
};

export default ManageSettlor;
