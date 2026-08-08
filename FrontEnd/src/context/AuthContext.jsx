import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const STORAGE_KEY = "resqgrid_user";

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  // login() takes the UserOut object returned by POST /users/login
  // (id, email, role, created_at), so the whole app knows who's signed in
  // and what role they have, not just a yes/no flag.
  function login(userData) {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdminLoggedIn: user?.role === "admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}