import Home from "../pages/PageUser/Home";
import Admin from "../pages/Admin";
import NoPage from "../pages/NoPage";
import ChatWeb from "../pages/PageUser/ChatWeb";
import Calendar from "../pages/PageUser/Calendar";
import KanbanBoard from "../pages/PageUser/KanbanBoard";
import AccountInfo from "../pages/PageUser/AccountInfo";
import NotificationList from "../pages/PageUser/NotificationList";
import Login from "../pages/PageAdmin/Login";
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
    path: "/task-board",
    page: KanbanBoard,
  },
  {
    path: "/account-info",
    page: AccountInfo,
  },
  {
    path: "/notification-list",
    page: NotificationList,
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
  {
    path: "/admin/login-ad",
    page: Login,
  },
];
