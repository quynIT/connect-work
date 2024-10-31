import Home from "../pages/PageUser/Home";
import Admin from "../pages/Admin";
import NoPage from "../pages/NoPage";
import ChatWeb from "../pages/PageUser/ChatWeb";
import Calendar from "../pages/PageUser/Calendar";
export const routes = [
  {
    path: "/",
    page: Home,
  },
  {
    path: "/chat-web",
    page: ChatWeb,
  },
  {
    path: "/roll-call",
    page: Calendar,
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
