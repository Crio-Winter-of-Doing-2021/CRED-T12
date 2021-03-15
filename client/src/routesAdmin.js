// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
// core components/views for Admin layout
import DashboardPage from "./views/Dashboard/Dashboard.js";
import UserProfile from "./views/UserProfile/UserProfile.js";
import TableList from "./views/TableList/TableList.js";
import Typography from "./views/Typography/Typography.js";
import CardPage from "./views/Card/CardPage.js";
import Maps from "./views/Maps/Maps.js";
import NotificationsPage from "./views/Notifications/Notifications.js";
import UpgradeToPro from "./views/UpgradeToPro/UpgradeToPro.js";
// core components/views for Home layout
import HomePage from "./views/HomePage/HomePage.js";

const adminRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
    inSidebar: true
  },
  {
    path: "/card",
    name: "Card",
    icon: BubbleChart,
    component: CardPage,
    layout: "/admin",
    inSidebar: true
  },
  {
    path: "/user",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
    inSidebar: true
  },
  {
    path: "/table",
    name: "Table List",
    icon: "content_paste",
    component: TableList,
    layout: "/admin",
    inSidebar: true
  },
  {
    path: "/typography",
    name: "Typography",
    icon: LibraryBooks,
    component: Typography,
    layout: "/admin",
    inSidebar: true
  },
  {
    path: "/maps",
    name: "Maps",
    icon: LocationOn,
    component: Maps,
    layout: "/admin",
    inSidebar: true
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin",
    inSidebar: true
  },
  {
    path: "/index",
    name: "Home",
    icon: Language,
    component: HomePage,
    layout: "/home",
    inSidebar: true
  },
  {
    path: "/upgrade-to-pro",
    name: "PRO",
    icon: Unarchive,
    component: UpgradeToPro,
    layout: "/admin",
    inSidebar: true
  },
];

export default adminRoutes;
