import Home from "../pages/Home";
import Admin from "../pages/Admin";
import NoPage from "../pages/NoPage";
export const routes = [
  {
    path: "/",
    page: Home,
  },
  {
    path: "*",
    page: NoPage,
  },
];
export const adminRoutes = [
  {
    path: "/admin",
    page: Admin,
  },
];
