import { PageHeader, RoutedTabs } from "../../../components/layouts";
const ManageDRA = () => {
  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Add DRA"
        desc="Check and filter all your medical appointments here"
        ctaText="New DRA"
      />

      <div className="mt-14">
        <RoutedTabs />
        Page
      </div>
    </div>
  );
};

export default ManageDRA;
