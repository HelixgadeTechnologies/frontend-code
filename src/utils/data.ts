import { dashboardIcon, trustIcon, settingsIcon } from "../assets/icons";

// const baseUrl_1 = import.meta.env.VITE_BASE_URL;
export const baseUrl = "https://hcdt-backend-code-1.onrender.com/api"//"http://localhost:8000/api"//"https://hcdt-api-09b9ed32e39a.herokuapp.com/api";

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

export const year = [
  {
    label: "2021",
    value: "2021",
  },
  {
    label: "2022",
    value: "2022",
  },
  {
    label: "2023",
    value: "2023",
  },
  {
    label: "2024",
    value: "2024",
  },

  {
    label: "2025",
    value: "2025",
  },
  {
    label: "2026",
    value: "2026",
  },
  {
    label: "2027",
    value: "2027",
  },
  {
    label: "2028",
    value: "2028",
  },
  {
    label: "2029",
    value: "2029",
  },
  {
    label: "2030",
    value: "2030",
  },
  {
    label: "2031",
    value: "2031",
  },
];

export const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];
