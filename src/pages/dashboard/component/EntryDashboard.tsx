import { observer } from "mobx-react-lite";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom";
import BiggerSkeleton from "../../../components/elements/BiggerSkeleton";
import EntryDashboardHeader from "../../../components/layouts/EntryDashboardHeader";
import { satisfactionStore as SatisfactionStore } from "../../communitySatisfaction/store/satisfactionStore";
import { conflictStore as ConflictStore } from "../../conflict/store/conflictStore";
import { economicImpactStore as EconomicImpactStore } from "../../EconomicImpact/store/economicImpactStore";
import { projectStore as ProjectStore } from "../../project/store/projectStore";
import { settingStore as SettingStore } from "../../Settings/store/settingStore";
import { trustStore as TrustStore } from "../../trust/store/trustStore";
import { dashboardStore as DashboardStore } from "./../store/dashboardStore";
// import GeneralProjectTable from "../../project/components/table/GeneralProjectTable";
import { INavData, routes2, routes2T } from "../../../utils/data";
import GeneralSatisfactionChart from "../../communitySatisfaction/components/chart/GeneralSatisfactionChart";
import GeneralSatisfactionModel from "../../communitySatisfaction/components/modal/GeneralSatisfactionModel";
import GeneralConflict from "../../conflict/components/chart/GeneralConflict";
import GeneralConflictView from "../../conflict/components/modal/GeneralConflictView";
import GeneralImpact from "../../EconomicImpact/components/chart/GeneralImpact";
import GeneralProjectDashboard from "../../project/components/chat/GeneralProjectDashboard";
import GeneralProjectView from "../../project/components/modal/GeneralProjectView";
import { IProjectView } from "../../project/types/interface";
import GeneralTrust from "../../trust/components/table/GeneralTrust";
import GeneralTEstablishment from "../../trustEstablishment/component/chart/GeneralTEstablishment";

interface LayoutProps {
  children?: ReactNode;
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
      // await settingStore.getRole();
      // await trustStore.getAllTrust();

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

      // Sync initial tab based on route
      if (location.pathname === "/trusts") {
        dashboardStore.selectedTab = 1;
      } else if (location.pathname === "/") {
        dashboardStore.selectedTab = 0;
      }
    }
    getInfo();
    return () => { };
  }, [dashboardStore, settingStore, trustStore, economicImpactStore, satisfactionStore, conflictStore, projectStore, location.pathname]);

  // Sync tab when route changes without remounting
  useEffect(() => {
    if (location.pathname === "/trusts") {
      dashboardStore.selectedTab = 1;
    } else if (location.pathname === "/") {
      dashboardStore.selectedTab = 0;
    }
  }, [location.pathname, dashboardStore]);

  const selectTab = useCallback((v: number) => {
    dashboardStore.selectedTab = v;
  }, [dashboardStore]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* EntryDashboardHeader uses simple routing now */}
      <EntryDashboardHeader onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
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
          trustStore={trustStore}
          satisfactionStore={satisfactionStore}
          economicImpactStore={economicImpactStore}
          conflictStore={conflictStore}
          projectStore={projectStore}
        />

        {/* Main content wrapper */}
        <div className="flex-1 flex flex-col overflow-y-auto w-full min-w-0 overflow-x-hidden">
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
  trustStore: any;
  satisfactionStore: any;
  economicImpactStore: any;
  conflictStore: any;
  projectStore: any;
}

const Sidebar: React.FC<SidebarProps> = observer(({
  sidebarOpen,
  setSidebarOpen,
  dashboardStore,
  selectTab,
  open,
  setOpen,
  location,
  searchParams,
  setSearchParams,
  navData,
  trustStore,
  satisfactionStore,
  economicImpactStore,
  conflictStore,
  projectStore
}) => {
  const getRouteLoading = (link: number): boolean => {
    if (link === 3) return projectStore.isDashboardLoading;
    if (link === 4) return conflictStore.isDashboardLoading;
    if (link === 5) return satisfactionStore.isDashboardLoading;
    if (link === 6) return economicImpactStore.isDashboardLoading;
    return false;
  };

  return (<aside
    className={`
      fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 w-64
      transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:relative lg:inset-auto lg:translate-x-0 lg:w-52 lg:h-full overflow-hidden flex flex-col
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
          {/* Header links visible only on mobile */}
          <div className="block lg:hidden mb-4 border-b border-gray-100 pb-4">
            <a
              href="https://hcdtmonitor.org/"
              className="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              Home
            </a>
            <a
              href="https://hcdtmonitor.org/about"
              className="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              About
            </a>
            <Link
              to="/"
              className="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              Aggregated Dashboard
            </Link>
            <Link
              to="/trusts"
              className="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              Trust Dashboard
            </Link>
            <a
              href="https://hcdtmonitor.org/contact"
              className="flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              Contact
            </a>
          </div>

          {navData.map((route) => (
            <div key={route.link}>
              <NavLink
                to="#"
                className={
                  dashboardStore.selectedTab === route.link
                    ? "flex items-center px-4 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-semibold transition-all duration-200 shadow-sm border border-blue-100"
                    : "flex items-center px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
                }
                onClick={async () => {
                  if (route.link === 5) {
                    await satisfactionStore.getSatisfactionDashboardByTrustId(trustStore.selectedTrustIdG, 0, "ALL", "ALL");
                    selectTab(route.link);
                    setSidebarOpen(false);
                    setOpen(open === route.id ? null : route.id);
                  } else if (route.link === 6) {
                    await economicImpactStore.getEconomicImpactDashboardByTrustId(trustStore.selectedTrustIdG, 0, "ALL", "ALL");
                    selectTab(route.link);
                    setSidebarOpen(false);
                    setOpen(open === route.id ? null : route.id);
                  } else if (route.link === 4) {
                    await conflictStore.getConflictDashboardByTrustId(trustStore.selectedTrustIdG, 0, "ALL", "ALL");
                    selectTab(route.link);
                    setSidebarOpen(false);
                    setOpen(open === route.id ? null : route.id);
                  } else if (route.link === 3) {
                    await projectStore.getProjectDashboardByTrustId(trustStore.selectedTrustIdG, 0, "ALL", "ALL");
                    selectTab(route.link);
                    setSidebarOpen(false);
                    setOpen(open === route.id ? null : route.id);
                  } else {
                    selectTab(route.link);
                    setSidebarOpen(false);
                    setOpen(open === route.id ? null : route.id);
                  }

                }}
              >
                <span className="text-sm font-medium">{route.name}</span>
                {getRouteLoading(route.link) && (
                  <svg className="ml-2 w-4 h-4 animate-spin text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
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
});



export default EntryDashboard;
