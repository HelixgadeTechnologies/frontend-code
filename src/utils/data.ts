import { dashboardIcon, trustIcon, settingsIcon } from "../assets/icons";

const baseUrl_1 = import.meta.env.VITE_BASE_URL;
export const baseUrl = "https://hcdt-api-09b9ed32e39a.herokuapp.com/api";

export const routes = [
  {
    id: 1,
    name: "Dashboard",
    title: "Dashboard",
    link: "/dashboard",
    icon: dashboardIcon,
  },
  {
    id: 2,
    name: "Trusts",
    title: "Trusts",
    link: "/dashboard/trusts",
    icon: trustIcon,
  },
  {
    id: 3,
    name: "Settings",
    title: "Settings",
    link: "/dashboard/settings",
    icon: settingsIcon,
  },
];
