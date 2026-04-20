import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { logoutIcon, settingsIcon, trustIcon } from "../../assets/icons";
import { authStore as AuthStore } from "../../pages/auth/store/authStore"
import { useCookies } from "react-cookie";
import { observer } from "mobx-react-lite";
import { createContext, useContext, useState } from "react";

const authStoreCTX = createContext(AuthStore);
const TrustSidebar = observer(() => {
  const authStore = useContext(authStoreCTX);
  const { id, name } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, removeCookie] = useCookies(["hcdt_admin"]);
  const [open, setOpen] = useState<number | null>(null);

  const handleLogout = () => {
    removeCookie("hcdt_admin", null, { path: "/" });
    sessionStorage.removeItem("qrjwt")
    sessionStorage.removeItem("selectedTrustId")
    if (authStore.user.role === "SUPER ADMIN") {
      navigate("/auth/admin");
    } else {
      navigate("/auth/1");
    }
  };

  const dashboardChildren = [
    { id: 1, name: "Trust Establishment", link: "trust-establishment" },
    { id: 2, name: "Project", link: "project" },
    { id: 3, name: "Conflict", link: "conflict" },
    { id: 4, name: "Community Satisfaction", link: "community-satisfaction" },
    { id: 5, name: "Economic Impact", link: "economic-impact" },
  ];

  const subRoutes = [
    {
      id: 0,
      name: "Dashboard",
      link: `#`,
      children: dashboardChildren,
    },
    {
      id: 1,
      name: "Trusts",
      link: `/dashboard/trusts`,
    },
    {
      id: 2,
      name: "Trust Establishment and Governance Structure",
      link: `/trust/${name}/${id}`,
    },
    {
      id: 3,
      name: "HCDT Development Projects",
      link: `/trust/${name}/${id}/hdct-projects`,
    },
    {
      id: 4,
      name: "Conflict Resolution",
      link: `/trust/${name}/${id}/conflict-resolution`,
    },
    {
      id: 5,
      name: "Community Satisfaction",
      link: `/trust/${name}/${id}/community-satisfaction`,
    },
    {
      id: 6,
      name: "Economic Impact of HCDT",
      link: `/trust/${name}/${id}/economic-impact`,
    },
    {
      id: 7,
      name: `${name?.toLocaleUpperCase()} Surveys Settings`,
      link: `/trust/${name}/${id}/settings`,
    },
  ];
  const adminRoutes = [
    {
      id: 0,
      name: "Dashboard",
      link: `/dashboard`,
      children: dashboardChildren,
    },
    {
      id: 1,
      name: "Trusts",
      link: `/dashboard/trusts`
    },
    {
      id: 2,
      name: "Trust Establishment and Governance Structure",
      link: `/trust/${name}/${id}`,
    },
    {
      id: 3,
      name: "HCDT Development Projects",
      link: `/trust/${name}/${id}/hdct-projects`,
    },
    {
      id: 4,
      name: "Conflict Resolution",
      link: `/trust/${name}/${id}/conflict-resolution`,
    },
    {
      id: 5,
      name: "Community Satisfaction",
      link: `/trust/${name}/${id}/community-satisfaction`,
    },
    {
      id: 6,
      name: "Economic Impact of HCDT",
      link: `/trust/${name}/${id}/economic-impact`,
    },

  ];
  const subRoutesDRA = [
    {
      id: 0,
      name: "Dashboard",
      link: `/dashboard`,
      children: dashboardChildren,
    },
    {
      id: 1,
      name: "Trusts",
      link: `/dashboard/trusts`,
    },
    {
      id: 2,
      name: "HCDT Development Projects",
      link: `/trust/${name}/${id}/`,
    },
    {
      id: 3,
      name: "Conflict Resolution",
      link: `/trust/${name}/${id}/conflict-resolution`,
    },
    {
      id: 4,
      name: "Community Satisfaction",
      link: `/trust/${name}/${id}/community-satisfaction`,
    },
    {
      id: 5,
      name: "Economic Impact of HCDT",
      link: `/trust/${name}/${id}/economic-impact`,
    },
  ];

  const subRoutesCommittee = [
    {
      id: 0,
      name: "Dashboard",
      link: `/dashboard`,
      children: dashboardChildren,
    },
    {
      id: 1,
      name: "Trusts",
      link: `/dashboard/trusts`,
    },
    {
      id: 2,
      name: "Trust Establishment and Governance Structure",
      link: `/trust/${name}/${id}`,
    },
    {
      id: 3,
      name: "HCDT Development Projects",
      link: `/trust/${name}/${id}/hdct-projects`,
    },
    {
      id: 4,
      name: "Conflict Resolution",
      link: `/trust/${name}/${id}/conflict-resolution`,
    },
  ];

  return (
    <div
      //className="hidden lg:flex h-full bg-white border-r border-gray-5  flex-col w-[272px]  py-6 px-4"
      className={`
      ${authStore.trustSidebarOpen ? "fixed inset-0 z-50 flex" : "hidden"}
      lg:flex
      h-full bg-white border-r border-gray-5 flex-col w-[272px] py-6 px-4
      transition-transform duration-200
    `}
      style={{ minHeight: "100vh" }}
    >
      {/* <div className=" font-bold text-4xl text-primary-300">I-HCDT-M</div> */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div
          className="text-xl lg:text-2xl font-bold relative w-fit cursor-pointer"
        >
          <span className="text-2xl font-bold text-black block">I-HCDT</span>
          <span className="text-xs block text-[#003B99] mt-1 tracking-widest">
            Monitor
          </span>
        </div>
        <button
          className="lg:hidden text-gray-500"
          onClick={() => authStore.trustSidebarOpen = false}
        >
          ✕
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-between py-8">
        <div>
          <Link to={`/trust/${name}/${id}`}>
            <li
              className={`  rounded transition-all px-4 py-3 flex items-center gap-x-2`}
            >
              <img src={trustIcon} alt={"trust"} />
              <span className="text-sm font-medium text-gray-3">Trusts</span>
            </li>
          </Link>          {/* Sub routes */}
          <div className="space-y-1">
            {((authStore.user.role == "SUPER ADMIN") ? subRoutes :
              (authStore.user.role == "ADMIN") ? adminRoutes :
                (authStore.user.role == "DRA" || authStore.user.role == "Data Reporting Agent (DRA)") ? subRoutesDRA :
                  (authStore.user.role == "Board of Trustee (BoT)" || authStore.user.role == "Management Committee (MC)" || authStore.user.role == "Advisory Committee (AC)") ? subRoutesCommittee : []
            ).map((route) => {
              const hasChildren = route.children && route.children.length > 0;
              const isExpanded = open === route.id;

              return (
                <div key={route.id}>
                  {hasChildren ? (
                    <div
                      onClick={() => {
                        setOpen(isExpanded ? null : route.id);
                        if (route.link) navigate(route.link);
                      }}
                      className={`${pathname === route.link ? "bg-primary-200/20" : "bg-white"} 
                        hover:bg-primary-200/20 rounded transition-all px-4 py-3 flex items-center justify-between cursor-pointer`}
                    >
                      <span className="text-sm font-medium text-gray-3">
                        {route.name}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ) : (
                    <Link to={route.link}>
                      <li
                        className={`${pathname === route.link ? "bg-primary-200/20" : "bg-white"} 
                          hover:bg-primary-200/20 rounded transition-all px-4 py-3 flex items-center gap-x-2`}
                      >
                        <span className="text-sm font-medium text-gray-3">
                          {route.name}
                        </span>
                      </li>
                    </Link>
                  )}

                  {/* Render children if expanded */}
                  {hasChildren && isExpanded && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {route.children?.map((child) => {
                        const isActive =
                          pathname === "/dashboard" &&
                          searchParams.get("section") === child.link;

                        return (
                          <li key={child.id}>
                            <button
                              className={`block px-3 py-2 rounded transition text-xs text-left w-full ${isActive
                                ? "bg-blue-50 text-blue-700 font-semibold"
                                : "hover:bg-gray-50 text-gray-600"
                                }`}
                              onClick={() => {
                                navigate(`/dashboard?section=${child.link}`);
                                authStore.trustSidebarOpen = false;
                              }}
                              type="button">
                              {child.name}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <Link to={`/dashboard/settings`}>
            <li
              className={`${pathname === "/dashboard/settings"
                ? "bg-primary-200/20"
                : "bg-white"
                } hover:bg-primary-200/20  rounded transition-all px-4 py-3 flex items-center gap-x-2`}
            >
              <img src={settingsIcon} alt={"settings"} />
              <span className="text-sm font-medium text-gray-3">Settings</span>
            </li>
          </Link>

          <button
            onClick={handleLogout}
            className={`w-full hover:bg-primary-200/20  rounded transition-all px-4 py-3 flex items-center gap-x-2`}
          >
            <img src={logoutIcon} alt="Logout" />
            <span className="text-sm font-medium text-gray-3">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default TrustSidebar;
