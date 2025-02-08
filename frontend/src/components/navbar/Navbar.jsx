import React from "react";
import { Link, useLocation } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./navigation";
import { Container } from "../ui";
import { useAuth } from "../../context/AuthContext";
import { twMerge } from "tailwind-merge";
import { BiLogOut } from "react-icons/bi"; // Importamos el ícono de logout

function Navbar() {
  const location = useLocation();
  const { isAuth, signout, user } = useAuth();

  const linkStyles = (path) =>
    twMerge(
      "text-slate-300 px-3 py-1 rounded-md transition-all duration-200 hover:bg-gray-800 flex items-center gap-x-2",
      location.pathname === path && "bg-sky-600 text-white hover:bg-sky-700"
    );

  return (
    <nav className="bg-gray-950 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <Container className="flex justify-between items-center py-4">
        <Link to="/">
          <h1 className="text-2xl font-bold text-amber-500 hover:text-amber-400 transition-colors">
            PERN Tasks
          </h1>
        </Link>
        <ul className="flex items-center gap-x-2">
          {isAuth ? (
            <>
              {privateRoutes.map(({ path, name, icon: Icon }) => (
                <li key={path}>
                  <Link to={path} className={linkStyles(path)}>
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
              <li className="flex gap-x-1 items-center justify-center">
                <img
                  src={user.gravatar}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-slate-300">{user.name}</span>
              </li>
              <li>
                <button
                  onClick={signout}
                  className="text-amber-200 px-4 py-1 rounded-md transition-all duration-200 hover:bg-amber-800/30 font-medium ml-2 flex items-center gap-x-2"
                >
                  <BiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            publicRoutes.map(({ path, name }) => (
              <li key={path}>
                <Link to={path} className={linkStyles(path)}>
                  <span>{name}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </Container>
    </nav>
  );
}

export default Navbar;
