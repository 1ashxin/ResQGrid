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

  // Login
  function login(userData) {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }

  // Logout
  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  // Update profile data
  function updateUser(updatedUser) {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "",
        isLoggedIn: !!user,
        isAdminLoggedIn: user?.role === "admin",
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}