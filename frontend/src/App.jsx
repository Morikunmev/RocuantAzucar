import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { MovimientosProvider } from "./context/MovimientosContext";
import EstadisticasPage from "./pages/EstadisticasPage";
import MovimientosPage from "./pages/MovimientoPage/MovimientosPage";
import ClientesPage from "./pages/ClientePage/ClientesPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/navbar/Navbar";
import { Container } from "./components/ui";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useState } from "react";

function App() {
  const { isAuth } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleSidebarExpand = (expanded) => {
    setIsSidebarExpanded(expanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      {isAuth && <Navbar onSidebarExpand={handleSidebarExpand} />}

      {isLoginPage ? (
        <div className="mx-auto">
          <Routes>
            <Route
              element={
                <ProtectedRoute
                  isAllowed={!isAuth}
                  redirectTo="/estadisticas"
                />
              }
            >
              <Route path="/login" element={<LoginPage />} />
            </Route>
          </Routes>
        </div>
      ) : (
        <div
          className={`transition-all duration-300 ${
            isAuth ? (isSidebarExpanded ? "ml-64" : "ml-16") : ""
          }`}
        >
          <Container className={isAuth ? "pt-[76px]" : ""}>
            <Routes>
              <Route
                element={
                  <ProtectedRoute isAllowed={isAuth} redirectTo="/login" />
                }
              >
                <Route path="/" element={<EstadisticasPage />} />
                <Route path="/estadisticas" element={<EstadisticasPage />} />
                <Route
                  element={
                    <MovimientosProvider>
                      <Outlet />
                    </MovimientosProvider>
                  }
                >
                  <Route path="/movimientos" element={<MovimientosPage />} />
                </Route>
                <Route path="/clientes" element={<ClientesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </div>
      )}
    </div>
  );
}

export default App;
