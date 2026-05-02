import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom";
import { dashboardStore as DashboardStore } from "./../store/dashboardStore"
import { economicImpactStore as EconomicImpactStore } from "../../EconomicImpact/store/economicImpactStore";
import { satisfactionStore as SatisfactionStore } from "../../communitySatisfaction/store/satisfactionStore";
import { conflictStore as ConflictStore } from "../../conflict/store/conflictStore";
import { projectStore as ProjectStore } from "../../project/store/projectStore";
import { trustStore as TrustStore } from "../../trust/store/trustStore";
import { settingStore as SettingStore } from "../../Settings/store/settingStore";
import { observer } from "mobx-react-lite";
import BiggerSkeleton from "../../../components/elements/BiggerSkeleton";
// import GeneralProjectTable from "../../project/components/table/GeneralProjectTable";
import { IProjectView } from "../../project/types/interface";
import GeneralProjectView from "../../project/components/modal/GeneralProjectView";
import GeneralTrust from "../../trust/components/table/GeneralTrust";
import GeneralProjectDashboard from "../../project/components/chat/GeneralProjectDashboard";
import { INavData, routes2, routes2T } from "../../../utils/data";
import GeneralTEstablishment from "../../trustEstablishment/component/chart/GeneralTEstablishment";
import GeneralConflict from "../../conflict/components/chart/GeneralConflict";
import GeneralConflictView from "../../conflict/components/modal/GeneralConflictView";
import GeneralSatisfactionChart from "../../communitySatisfaction/components/chart/GeneralSatisfactionChart";
import GeneralSatisfactionModel from "../../communitySatisfaction/components/modal/GeneralSatisfactionModel";
import GeneralImpact from "../../EconomicImpact/components/chart/GeneralImpact";

interface LayoutProps {
  children: ReactNode;
}

const DashboardStoreCTX = createContext(DashboardStore)
const trustStoreCTX = createContext(TrustStore)
const economicImpactStoreCTX = createContext(EconomicImpactStore)
const satisfactionStoreCTX = createContext(SatisfactionStore)
const conflictStoreCTX = createContext(ConflictStore)
const projectStoreCTX = createContext(ProjectStore)
const settingStoreCTX = createContext(SettingStore)

const EntryDashboard: React.FC<LayoutProps> = observer(({ children }) => {
  const dashboardStore = useContext(DashboardStoreCTX)
  const settingStore = useContext(settingStoreCTX)
  const trustStore = useContext(trustStoreCTX)
  const economicImpactStore = useContext(economicImpactStoreCTX)
  const satisfactionStore = useContext(satisfactionStoreCTX)
  const conflictStore = useContext(conflictStoreCTX)
  const projectStore = useContext(projectStoreCTX)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();


  useEffect(() => {
    async function getInfo() {
      dashboardStore.isLoading = true;
      dashboardStore.selectedTrust = "ALL";
      dashboardStore.selectedSettlor = "ALL";
      dashboardStore.selectedState = "ALL";
      dashboardStore.selectedYear = 0;
      dashboardStore.dashboardData = null;
      trustStore.getAllStates()
      await dashboardStore.getDashboard("ALL", 0, "ALL", "ALL")
      economicImpactStore.isDashboardLoading = false;
      economicImpactStore.dashboardData = null;
      await economicImpactStore.getEconomicImpactDashboardByTrustId("ALL", 0, "ALL", "ALL");
      satisfactionStore.isDashboardLoading = false;
      satisfactionStore.dashboardData = null;
      await satisfactionStore.getSatisfactionDashboardByTrustId("ALL", 0, "ALL", "ALL");
      conflictStore.isDashboardLoading = false;
      conflictStore.dashboardData = null;
      await conflictStore.getConflictDashboardByTrustId("ALL", 0, "ALL", "ALL");
      projectStore.isDashboardLoading = false;
      projectStore.dashboardData = null;
      await projectStore.getProjectDashboardByTrustId("ALL", 0, "ALL", "ALL");
      await projectStore.getProjectsForGeneralProject();
      await settingStore.getAllSettlor();
      await trustStore.getAllTrust();
      dashboardStore.isLoading = false;
    }
    getInfo();
    return () => { };
  }, [dashboardStore, settingStore, trustStore, economicImpactStore, satisfactionStore, conflictStore, projectStore]);

  const selectTab = useCallback((v: number) => {
    dashboardStore.selectedTab = v;
  }, [dashboardStore]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Redesigned Header */}
      <header className="w-full sticky top-0 z-40 flex flex-col shadow-sm bg-white" style={{ minHeight: "106px" }}>
        {/* Top Tier */}
        <div className="bg-[#002060] text-white px-4 lg:px-8 flex items-center justify-between py-2 lg:py-0 lg:h-[34px]">
          <div className="flex-1 text-center text-sm lg:text-base font-bold tracking-[0.05em] uppercase leading-tight lg:leading-normal">
            INDEPENDENT HOST COMMUNITY DEVELOPMENT TRUST MONITORING AND EVALUATION PLATFORM
          </div>
          <div className="flex items-center gap-3 ml-4 shrink-0">
            <Link
              to={`/auth/${1}`}
              className="text-[10px] lg:text-xs font-semibold px-3 py-1 rounded hover:bg-white/10 transition uppercase tracking-wider"
            >
              Login
            </Link>
            <Link
              to={`/auth/${2}`}
              className="text-[10px] lg:text-xs font-semibold px-4 py-1 bg-[#1671D9] text-white rounded hover:bg-blue-600 transition uppercase tracking-wider"
            >
              Sign Up Free
            </Link>
          </div>
        </div>

        {/* Bottom Tier */}
        <div className="bg-[#E9E9E9] px-4 lg:px-12 flex items-center justify-between border-b border-gray-300" style={{ height: "72px" }}>
          <div
            onClick={() => window.location.href = "https://hcdtmonitor.org"}
            className="cursor-pointer flex flex-col leading-none shrink-0"
          >
            <span className="text-xl lg:text-2xl font-bold text-black">I-HCDT</span>
            <span className="text-[9px] lg:text-[10px] font-bold text-[#003B99] tracking-[0.2em] uppercase mt-1">
              Monitor
            </span>
          </div>

          <div className="flex items-center gap-4 lg:gap-8 ml-auto">
            <nav className="flex items-center gap-3 lg:gap-8">
              <a href="https://hcdtmonitor.org/" className="text-gray-700 hover:text-blue-700 font-medium transition text-[11px] lg:text-sm whitespace-nowrap">Home</a>
              <a href="https://hcdtmonitor.org/about" className="text-gray-700 hover:text-blue-700 font-medium transition text-[11px] lg:text-sm whitespace-nowrap">About</a>
              <button
                onClick={() => selectTab(0)}
                className={`font-medium transition pb-1 text-[11px] lg:text-sm whitespace-nowrap ${dashboardStore.selectedTab === 0 ? "text-blue-700 border-b-2 border-blue-700" : "text-gray-700 hover:text-blue-700"}`}
              >
                Aggregated Dashboard
              </button>
           
            </nav>

            <button
              className="lg:hidden text-2xl"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          dashboardStore={dashboardStore}
          selectTab={selectTab}
          open={open}
          setOpen={setOpen}
          location={location}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          navData={dashboardStore.selectedTab > 1 ? routes2T : routes2}
        />

        {/* Main content wrapper */}
        <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-52 w-full min-w-0 overflow-x-hidden">
          {/* Main Content */}
          <main className="flex-1 w-full px-2 sm:px-6 py-4">
          {dashboardStore.selectedTab === 0 && (
            <>
              {dashboardStore.isLoading || settingStore.isLoading ? (
                <BiggerSkeleton />
              ) : (
                <>{children}</>
              )}
            </>
          )}
          {dashboardStore.selectedTab === 1 && <GeneralTrust />}
          {dashboardStore.selectedTab === 2 && <GeneralTEstablishment />}
          {dashboardStore.selectedTab === 3 && (<GeneralProjectDashboard />)}
          {dashboardStore.selectedTab === 33 && (
            <GeneralProjectView
              dashboardStore={dashboardStore}
              projectData={projectStore.selectedProject as IProjectView}
            />
          )}
          {dashboardStore.selectedTab === 4 && (<GeneralConflict />)}
          {dashboardStore.selectedTab === 44 && (<GeneralConflictView />)}


          {dashboardStore.selectedTab === 5 && (<GeneralSatisfactionChart satisfactionStore={satisfactionStore} />)}
          {dashboardStore.selectedTab === 55 && (<GeneralSatisfactionModel satisfactionStore={satisfactionStore} />)}

          {dashboardStore.selectedTab === 6 && (<GeneralImpact economicImpactStore={economicImpactStore} />)}
        </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
});


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  dashboardStore: any;
  selectTab: (v: number) => void;
  open: number | null;
  setOpen: (v: number | null) => void;
  location: any;
  searchParams: any;
  setSearchParams: any;
  navData: Array<INavData>
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  dashboardStore,
  selectTab,
  open,
  setOpen,
  location,
  searchParams,
  setSearchParams,
  navData
}) => (
  <aside
    className={`
      fixed inset-y-0 lg:top-[106px] lg:bottom-0 left-0 z-50 bg-white border-r border-gray-200 w-64 lg:w-52
      transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:h-[calc(100vh-106px)] h-full overflow-hidden flex flex-col
    `}
  >
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b lg:hidden">
        <div
          onClick={() => window.location.href = "https://hcdtmonitor.org"}
          className="text-xl lg:text-2xl font-bold relative w-fit cursor-pointer"
        >
          <span className="text-2xl font-bold text-black block">I-HCDT</span>
          <span className="text-[10px] block text-[#003B99] mt-1 tracking-[0.2em] uppercase">
            Monitor
          </span>
        </div>
        <button
          className="lg:hidden text-gray-500"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>
      </div>
      <div className="flex-1 flex flex-col py-4 overflow-y-auto">
        <nav className="flex flex-col gap-1 px-3">
          {navData.map((route) => (
            <div key={route.link}>
              <NavLink
                to="#"
                className={
                  dashboardStore.selectedTab === route.link
                    ? "flex items-center px-4 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-semibold transition-all duration-200 shadow-sm border border-blue-100"
                    : "flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
                }
                onClick={() => {
                  selectTab(route.link);
                  setSidebarOpen(false);
                  setOpen(open === route.id ? null : route.id);
                }}
              >
                <span className="text-sm font-medium">{route.name}</span>
                {route.children && route.children.length > 0 && (
                  <svg
                    className={`ml-auto w-4 h-4 transition-transform duration-200 ${open === route.id ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </NavLink>
              {/* Children */}
              {route.children && route.children.length > 0 && open === route.id && (
                <ul className="ml-6 mt-1 flex flex-col gap-1">
                  {route.children.map(child => {
                    const isActive = location.pathname === "/" && searchParams.get("section") === child.link;
                    return (
                      <li key={child.id}>
                        <button
                          className={`w-full text-left px-3 py-1 rounded text-sm transition ${isActive
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "hover:bg-gray-50 text-gray-600"
                            }`}
                          onClick={() => {
                            selectTab(0);
                            setSearchParams({ section: child.link });
                            setSidebarOpen(false);
                          }}
                          type="button"
                        >
                          <span className="font-medium text-xs text-gray-600">{child.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  </aside>
);



export default EntryDashboard;
