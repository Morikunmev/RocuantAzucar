import React, { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { TbChartHistogram } from "react-icons/tb";
import { BiTransfer } from "react-icons/bi";
// import { HiUsers } from "react-icons/hi";

function Sidebar({ onExpand = () => {} }) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsExpanded(true);
    onExpand(true);
  }, [onExpand]);

  const handleMouseLeave = useCallback(() => {
    setIsExpanded(false);
    onExpand(false);
  }, [onExpand]);

  const menuItems = [
    {
      name: "Estadísticas",
      path: "/estadisticas",
      icon: TbChartHistogram,
    },
    {
      name: "Movimientos",
      path: "/movimientos",
      icon: BiTransfer,
    },
    // {
    //   name: "Clientes",
    //   path: "/clientes",
    //   icon: HiUsers,
    // },
  ];

  return (
    <div
      className={`fixed left-0 top-[4rem] h-screen bg-gray-950 text-white shadow-lg transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <nav className="mt-8">
        <ul className="space-y-4">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center px-3 py-3 mx-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? "bg-sky-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Icon className={`w-6 h-6 ${!isExpanded && "mx-auto"}`} />
                <span
                  className={`ml-3 transition-opacity duration-300 ${
                    isExpanded ? "opacity-100" : "opacity-0 w-0"
                  } whitespace-nowrap`}
                >
                  {name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
