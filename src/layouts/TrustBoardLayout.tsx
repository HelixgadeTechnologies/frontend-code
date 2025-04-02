import { Outlet } from "react-router-dom";

import { TrustHeader, TrustSidebar } from "../components/layouts";

const TrustBoardLayout = () => {
  return (
    <div className="flex h-screen bg-off-white">
      <TrustSidebar />
      <main className="flex-1 h-full overflow-y-auto">
        <TrustHeader />
        <Outlet />
      </main>
    </div>
  );
};

export default TrustBoardLayout;
