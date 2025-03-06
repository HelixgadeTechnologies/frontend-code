import { PageHeader, RoutedTabs } from "../../../components/layouts";

const ManageNUPRC = () => {
  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add NUPRC-ADR"
        desc="Check and filter all your medical appointments here"
        ctaText="New NUPRC-ADR"
      />

      <div className="mt-14">
        <RoutedTabs />
        Page
      </div>
    </div>
  );
};

export default ManageNUPRC;
