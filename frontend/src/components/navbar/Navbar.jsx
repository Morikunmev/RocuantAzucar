import React from "react";
import { Link, useLocation } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./navigation";
import { Container } from "../ui";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const { isAuth, signout } = useAuth();

  return (
    <nav className="bg-gray-950 fixed top-0 left-0 right-0 z-50">
      <Container className="flex justify-between py-3">
        <Link to="/">
          <h1 className="text-2xl font-bold text-amber-500">PERN Tasks</h1>
        </Link>
        <ul className="flex gap-x-4">
          {isAuth ? (
            <>
              {privateRoutes.map(({ path, name }) => (
                <li
                  key={path}
                  className={`text-amber-100 rounded-lg transition-colors px-4 py-2 
                              ${
                                location.pathname === path
                                  ? "bg-amber-700 text-white"
                                  : "hover:bg-amber-800/20"
                              }`}
                >
                  <Link to={path} className="font-medium">
                    {name}
                  </Link>
                </li>
              ))}
              <li
                className="text-amber-100 rounded-lg transition-colors px-4 py-2 hover:bg-amber-800/20 cursor-pointer font-medium"
                onClick={() => {
                  signout();
                }}
              >
                Logout
              </li>
            </>
          ) : (
            // Rutas públicas cuando el usuario no está autenticado
            publicRoutes.map(({ path, name }) => (
              <li
                key={path}
                className={`text-amber-100 rounded-lg transition-colors px-4 py-2 
                ${
                  location.pathname === path
                    ? "bg-amber-700 text-white"
                    : "hover:bg-amber-800/20"
                }`}
              >
                <Link to={path} className="font-medium">
                  {name}
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
