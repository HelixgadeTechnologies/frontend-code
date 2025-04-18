import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { logoutIcon, settingsIcon, trustIcon } from "../../assets/icons";

import { useCookies } from "react-cookie";

const TrustSidebar = () => {
  const { id, name } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [, removeCookie] = useCookies(["hcdt_admin"]);

  const handleLogout = () => {
    removeCookie("hcdt_admin", null, { path: "/" });
    navigate("/");
  };

  const subRoutes = [
    {
      id: 1,
      name: "Trust Establishment and Governance Structure",
      link: `/trust/${name}/${id}/trust-establishment/update`,
    },
    {
      id: 2,
      name: "HCDT Development Projects",
      link: `/trust/${name}/${id}/hdct-projects`,
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

  return (
    <div className="hidden lg:flex h-full bg-white border-r border-gray-5  flex-col w-[272px]  py-6 px-4">
      <div className=" font-bold text-4xl text-primary-300">HCDT</div>

      <div className="flex-1 flex flex-col justify-between py-8">
        <div>
          <Link to={`/trust/${name}/${id}`}>
            <li
              className={`  rounded transition-all px-4 py-3 flex items-center gap-x-2`}
            >
              <img src={trustIcon} alt={"trust"} />
              <span className="text-sm font-medium text-gray-3">Trusts</span>
            </li>
          </Link>
          {/* Sub routes */}
          <div>
            {subRoutes.map((route) => (
              <Link key={route.link} to={route.link}>
                <li
                  className={`${
                    pathname === route.link ? "bg-primary-200/20" : "bg-white"
                  } hover:bg-primary-200/20  rounded transition-all px-4 py-3 flex items-center gap-x-2`}
                >
                  <span className="text-sm font-medium text-gray-3">
                    {route.name}
                  </span>
                </li>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <Link to={`/dashboard/settings`}>
            <li
              className={`${
                pathname === "/dashboard/settings"
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
};

export default TrustSidebar;
