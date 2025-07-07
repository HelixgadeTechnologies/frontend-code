import { useLocation, Link } from "react-router-dom";
import { authStore as AuthStore } from "../../pages/auth/store/authStore"
import { createContext, useContext } from "react";
import { observer } from "mobx-react-lite";
const tabRoutes = [
  {
    name: "Profile",
    link: "/dashboard/settings",
  },
  {
    name: "Admin",
    link: "/dashboard/settings/manage-admin",
  },
  {
    name: "Add DRA",
    link: "/dashboard/settings/manage-dra",
  },
  {
    name: "NUPRC-ADR",
    link: "/dashboard/settings/manage-nuprc",
  },
  {
    name: "Add Settlor",
    link: "/dashboard/settings/manage-settlors",
  },
];
const tabRoutesADMIN = [
  {
    name: "Profile",
    link: "/dashboard/settings",
  },
  {
    name: "Add DRA",
    link: "/dashboard/settings/manage-dra",
  },
  {
    name: "NUPRC-ADR",
    link: "/dashboard/settings/manage-nuprc",
  },
  {
    name: "Add Settlor",
    link: "/dashboard/settings/manage-settlors",
  },
];
// const tabRoutesDRA = [
//   {
//     name: "Profile",
//     link: "/dashboard/settings",
//   }
// ];
const authStoreCTX = createContext(AuthStore);
const RoutedTabs = observer(() => {
  const authStore = useContext(authStoreCTX)
  const { pathname } = useLocation();

  return (
    <ul className="w-full lg:w-2/3 overflow-x-auto whitespace-nowrap flex items-center">
      {(authStore.user.role == "SUPER ADMIN") && tabRoutes?.map((route) => (
        <Link to={route.link} key={route.name}>
          <li
            className={`${pathname === route.link
              ? "border-b-2 border-primary-400 pl-0 pr-4 "
              : "px-4"
              } transition-all ease-in-out py-4 flex items-start`}
          >
            <span className="text-sm text-gray-6">{route.name}</span>
          </li>
        </Link>
      ))}
      {(authStore.user.role == "ADMIN") && tabRoutesADMIN?.map((route) => (
        <Link to={route.link} key={route.name}>
          <li
            className={`${pathname === route.link
              ? "border-b-2 border-primary-400 pl-0 pr-4 "
              : "px-4"
              } transition-all ease-in-out py-4 flex items-start`}
          >
            <span className="text-sm text-gray-6">{route.name}</span>
          </li>
        </Link>
      ))}
    </ul>
  );
});

export default RoutedTabs;
