import { Outlet } from "react-router-dom";

// this is where the general layout of dashboard lies, the sidebar, header and body

const DashboardLayout = () => {
  return (
    <div>
      Dashboard View
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
