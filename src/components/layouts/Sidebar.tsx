import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutIcon } from "../../assets/icons";

import { routes } from "../../utils/data";

import { useCookies } from "react-cookie";
import { useState } from "react";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [, removeCookie] = useCookies(["hcdt_admin"]);
  const [open, setOpen] = useState<number | null>(null);

  const handleLogout = () => {
    removeCookie("hcdt_admin", null, { path: "/" });
    navigate("/");
  };

  return (
    <div className="hidden lg:flex h-full bg-white border-r border-gray-5  flex-col w-[272px]  py-6 px-4">
      <div className=" font-bold text-4xl text-primary-300">I-HCDT</div>

      <div className="flex-1 flex flex-col justify-between py-8">
        <div>
          {routes.slice(0, 2).map((route) => (
            <>
              <Link
                key={route.link}
                to={route.link}
                onClick={() => setOpen(open === route.id ? null : route.id)}
              >
                <li
                  className={`${pathname === route.link ? "bg-primary-200/20" : "bg-white"
                    } hover:bg-primary-200/20  rounded transition-all px-4 py-3 flex items-center gap-x-2`}
                >
                  <img src={route.icon} alt={route.name} />
                  <span className="text-sm font-medium text-gray-3">
                    {route.name}
                  </span>
                  {route.children && route.children.length > 0 && (
                    <svg
                      className={`ml-auto w-4 h-4 transition-transform ${open === route.id ? "rotate-90" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </li>
              </Link>
              {/* Children */}
              {route.children && route.children.length > 0 && open === route.id && (
                <ul className="ml-8 mt-1 space-y-1">
                  {route.children.map(child => (
                    <li key={child.id}>
                      <button
                        className={`block px-3 py-1 rounded transition ${location.pathname.includes(child.link)
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50 text-gray-600"
                          }`}
                        onClick={() => {
                          const el = document.getElementById(child.link);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        type="button"
                      >
                        {child.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ))}
        </div>

        <div>
          {routes.slice(2, 3).map((route) => (
            <Link key={route.link} to={route.link}>
              <li
                className={`${pathname === route.link ? "bg-primary-200/20" : "bg-white"
                  } hover:bg-primary-200/20  rounded transition-all px-4 py-3 flex items-center gap-x-2`}
                onClick={() => setOpen(null)}
              >
                <img src={route.icon} alt={route.name} />
                <span className="text-sm font-medium text-gray-3">
                  {route.name}
                </span>
              </li>
            </Link>
          ))}

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

export default Sidebar;
