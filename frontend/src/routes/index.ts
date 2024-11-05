import Home from "../pages/PageUser/Home";
import Admin from "../pages/PageAdmin/Admin";
import NoPage from "../pages/NoPage";
import ChatWeb from "../pages/PageUser/ChatWeb";
import Calendar from "../pages/PageUser/Calendar";
import KanbanBoard from "../pages/PageUser/KanbanBoard";
import AccountInfo from "../pages/PageUser/AccountInfo";
import NotificationList from "../pages/PageUser/NotificationList";
import Login from "../pages/PageAdmin/Login";
import MemberList from "../pages/PageAdmin/MemberList";
import UserDetails from "../components/admin/UserDetails";
import AddEmployee from "../components/admin/AddEmployee";
import MgNotification from "../pages/PageAdmin/MgNotification";
import MgAttendance from "../pages/PageAdmin/MgAttendance";
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
    path: "/admin/member-list",
    page: MemberList,
  },
  {
    path: "/admin/add-member",
    page: AddEmployee,
  },
  {
    path: "/admin/user-details",
    page: UserDetails,
  },
  {
    path: "/admin/login-ad",
    page: Login,
  },
  {
    path: "/admin/ql-notification",
    page: MgNotification,
  },
  {
    path: "/admin/ql-attendance",
    page: MgAttendance,
  },
];
