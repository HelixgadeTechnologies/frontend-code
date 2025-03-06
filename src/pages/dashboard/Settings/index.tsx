import { PageHeader, RoutedTabs } from "../../../components/layouts";

const ProfileSettings = () => {
  return (
    <div className="px-10 py-11">
      <PageHeader
        title="Settings"
        desc="Take a look at your policies and the new policy to see what is covered"
        ctaText="Change Password"
      />

      <div className="mt-14">
        <RoutedTabs />
        Page
      </div>
    </div>
  );
};

export default ProfileSettings;
