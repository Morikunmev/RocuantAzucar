import { MdTaskAlt } from "react-icons/md";
import { BiTask, BiUserCircle } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";

export const publicRoutes = [
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Login",
    path: "/login",
  },
  {
    name: "Register",
    path: "/register",
  },
];

export const privateRoutes = [
  {
    name: "Home",
    path: "/",
    icon: AiOutlineHome,
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: BiTask,
  },
  {
    name: "New Task",
    path: "/tasks/new",
    icon: IoAddCircleOutline,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: BiUserCircle,
  },
];