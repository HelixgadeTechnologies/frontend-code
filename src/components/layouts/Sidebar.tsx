import { Link, useLocation } from "react-router-dom";
import { logoutIcon } from "../../assets/icons";

import { routes } from "../../utils/data";

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="h-full bg-white flex flex-col w-[272px]  py-6 px-4">
      <div className=" font-bold text-4xl text-primary-300">HCDT</div>

      <div className="flex-1 flex flex-col justify-between py-8">
        <div>
          {routes.slice(0, 2).map((route) => (
            <Link to={route.link}>
              <li
                className={`${
                  pathname === route.link ? "bg-primary-200/20" : "bg-white"
                } hover:bg-primary-200/20  rounded transition-all px-4 py-3 flex items-center gap-x-2`}
              >
                <img src={route.icon} alt={route.name} />
                <span className="text-sm font-medium text-gray-300">
                  {route.name}
                </span>
              </li>
            </Link>
          ))}
        </div>

        <div>
          {routes.slice(2, 3).map((route) => (
            <Link to={route.link}>
              <li
                className={`${
                  pathname === route.link ? "bg-primary-200/20" : "bg-white"
                } hover:bg-primary-200/20  rounded transition-all px-4 py-3 flex items-center gap-x-2`}
              >
                <img src={route.icon} alt={route.name} />
                <span className="text-sm font-medium text-gray-300">
                  {route.name}
                </span>
              </li>
            </Link>
          ))}

          <li
            className={`hover:bg-primary-200/20  rounded transition-all px-4 py-3 flex items-center gap-x-2`}
          >
            <img src={logoutIcon} alt="Logout" />
            <span className="text-sm font-medium text-gray-300">Logout</span>
          </li>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
