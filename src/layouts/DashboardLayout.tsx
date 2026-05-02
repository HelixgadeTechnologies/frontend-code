import { Outlet } from "react-router-dom";

import { Sidebar, Header, EntryDashboardHeader } from "../components/layouts";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-off-white">
      <EntryDashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto">
          <Header />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
