import { Outlet } from "react-router-dom";

import { Sidebar, Header, EntryDashboardHeader } from "../components/layouts";

import { useContext, createContext } from "react";
import { authStore as AuthStore } from "../pages/auth/store/authStore";

const AuthStoreCTX = createContext(AuthStore);

const DashboardLayout = () => {
  const authStore = useContext(AuthStoreCTX);
  return (
    <div className="flex flex-col h-screen bg-off-white">
      <EntryDashboardHeader onMenuClick={() => authStore.sidebarOpen = true} />
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
