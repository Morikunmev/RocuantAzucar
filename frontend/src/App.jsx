import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import TaskFormPage from "./pages/TaskFormPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/navbar/Navbar";
import { Container } from "./components/ui";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TaskProvider } from "./context/TaskContext";

function App() {
  const { isAuth } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {isAuth && <Navbar />}

      {isLoginPage ? (
        <div className="mx-auto">
          <Routes>
            <Route
              element={
                <ProtectedRoute isAllowed={!isAuth} redirectTo="/tasks" />
              }
            >
              <Route path="/login" element={<LoginPage />} />
            </Route>
          </Routes>
        </div>
      ) : (
        <Container className={isAuth ? "pt-[76px]" : ""}>
          <Routes>
            <Route
              element={
                <ProtectedRoute isAllowed={isAuth} redirectTo="/login" />
              }
            >
              <Route path="/" element={<HomePage />} />
              <Route
                element={
                  <TaskProvider>
                    <Outlet />
                  </TaskProvider>
                }
              >
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/new" element={<TaskFormPage />} />
                <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
              </Route>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      )}
    </>
  );
}

// Añadimos la exportación por defecto
export default App;
