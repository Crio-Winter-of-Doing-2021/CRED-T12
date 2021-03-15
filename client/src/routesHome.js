// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Language from "@material-ui/icons/Language";
// core components/views for Home layout
import HomePage from "./views/HomePage/HomePage.js";
import SignIn from "./views/SignIn/SignIn.js";
import SignUp from "./views/SignUp/SignUp.js";

const homeRoutes = [
  {
    path: "/index",
    name: "Home",
    icon: Language,
    component: HomePage,
    layout: "/home"
  },
  {
    path: "/signin",
    name: "SignIn",
    icon: Dashboard,
    component: SignIn,
    layout: "/home"
  },
  {
    path: "/signup",
    name: "SignUp",
    icon: Dashboard,
    component: SignUp,
    layout: "/home"
  },
];

export default homeRoutes;