import { Outlet } from "react-router-dom";
import { TrustSidebar } from "../components/layouts";
import EntryDashboardHeader from "../components/layouts/EntryDashboardHeader";
import { useContext, createContext } from "react";
import { authStore as AuthStore } from "../pages/auth/store/authStore";

const AuthStoreCTX = createContext(AuthStore);

const TrustBoardLayout = () => {
  const authStore = useContext(AuthStoreCTX);
  return (
    <div className="flex flex-col h-screen bg-off-white">
      <EntryDashboardHeader onMenuClick={() => authStore.trustSidebarOpen = true} />
      <div className="flex flex-1 overflow-hidden">
        <TrustSidebar />
        <main className="flex-1 h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TrustBoardLayout;
