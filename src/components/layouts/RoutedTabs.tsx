import { useLocation, Link } from "react-router-dom";

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

const RoutedTabs = () => {
  const { pathname } = useLocation();

  return (
    <ul className="w-full lg:w-2/3 overflow-x-auto whitespace-nowrap flex items-center  border-b border-gray-7">
      {tabRoutes?.map((route) => (
        <Link to={route.link} key={route.name}>
          <li
            className={`${
              pathname === route.link
                ? "border-b-2 border-primary-400 pl-0 pr-4 "
                : "px-4"
            } transition-all ease-in-out py-4 flex items-start`}
          >
            <span className="text-sm text-gray-6">{route.name}</span>
            {route.name === "Add Settlor" && (
              <span className=" text-[10px] text-white bg-primary-400 h-4 w-4 rounded-full flex items-center justify-center">
                3
              </span>
            )}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default RoutedTabs;
