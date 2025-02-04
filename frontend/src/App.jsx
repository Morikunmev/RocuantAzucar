import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";
import TaskFormPage from "./pages/TaskFormPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/navbar/Navbar";
import { Container } from "./components/ui";

function App() {
  return (
    <>
      <Navbar />
      <Container className="pt-[76px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/1/edit" element={<TaskFormPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
