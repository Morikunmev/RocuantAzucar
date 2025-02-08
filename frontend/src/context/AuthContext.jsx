import axios from "../api/axios";
import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const signin = async (data) => {
    try {
      setErrors(null);
      const res = await axios.post("/signin", data);
      setUser(res.data);
      setIsAuth(true);
      return res.data;
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const signup = async (data) => {
    try {
      setErrors(null);
      const res = await axios.post("/signup", data);
      setUser(res.data);
      setIsAuth(true);
      return res.data;
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };
  const signout = async () => {
    await axios.post("/signout");
    setUser(null);
    setIsAuth(false);
  };

  useEffect(() => {
    // Intentar obtener el perfil al cargar
    axios
      .get("/profile")
      .then((res) => {
        setUser(res.data);
        setIsAuth(true);
      })
      .catch((err) => {
        setUser(null);
        setIsAuth(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    const clean = setTimeout(() => {
      setErrors(null);
    }, 3000);
    return () => clearTimeout(clean);
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        errors,
        loading,
        signup,
        signin,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
