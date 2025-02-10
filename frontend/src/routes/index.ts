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
import MgSalary from "../pages/PageAdmin/MgSalary";
import MgTask from "../pages/PageAdmin/MgTask";
import ChangePassword from "../pages/PageUser/ChangePassword";
import ProjectList from "../pages/PageUser/ProjectList";
import ViewAttendance from "../components/admin/ViewAttendance";
import EditAttendance from "../components/admin/EditAttendance";
import LeaveRequestList from "../pages/PageUser/LeaveRequestList";
import MonthlyPayroll from "../components/admin/MonthlyPayroll";
import MgProject from "../pages/PageAdmin/MgProject";
import MgRecruitment from "../pages/PageAdmin/MgRecruitment";
import Recruitment from "../pages/PageUser/Recruitment";
import JobDetailPage from "../components/user/JobDetail";
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
    path: "/task-board/:projectId",
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
    path: "/change-password",
    page: ChangePassword,
  },
  {
    path: "/project-list",
    page: ProjectList,
  },
  {
    path: "/leave-request",
    page: LeaveRequestList,
  },
  {
    path: "/recruitment",
    page: Recruitment,
  },
  {
    path: "/recruitment/:id",
    page: JobDetailPage,
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
  {
    path: "/admin/ql-salary",
    page: MgSalary,
  },
  {
    path: "/admin/ql-task",
    page: MgTask,
  },
  {
    path: "/admin/view-attendance/:id",
    page: ViewAttendance,
  },
  {
    path: "/admin/edit-attendance/:id",
    page: EditAttendance,
  },
  {
    path: "/admin/monthly-salary/:id",
    page: MonthlyPayroll,
  },
  {
    path: "/admin/mg-project",
    page: MgProject,
  },
  {
    path: "/admin/mg-recruitment",
    page: MgRecruitment,
  },
];
