import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation } from "./navigation";
import { Container } from "../ui";

function Navbar() {
  const location = useLocation();
  return (
    <nav className="bg-gray-950 fixed top-0 left-0 right-0 z-50">
      <Container className="flex justify-between py-3">
        <Link to="/">
          <h1 className="text-2xl font-bold text-amber-500">PERN Tasks</h1>
        </Link>
        <ul className="flex gap-x-4">
          {navigation.map(({ path, name }) => (
            <li
              className={`text-amber-100 rounded-lg transition-colors px-4 py-2 
              ${
                location.pathname === path
                  ? "bg-amber-700 text-white"
                  : "hover:bg-amber-800/20"
              }`}
              key={path}
            >
              <Link to={path} className="font-medium">
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}

export default Navbar;
