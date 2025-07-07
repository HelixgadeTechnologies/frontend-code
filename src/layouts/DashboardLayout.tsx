import { Outlet } from "react-router-dom";

import { Sidebar, Header } from "../components/layouts";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-off-white">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
