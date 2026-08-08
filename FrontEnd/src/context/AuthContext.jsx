import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  function login() {
    setIsAdminLoggedIn(true);
  }

  function logout() {
    setIsAdminLoggedIn(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAdminLoggedIn,
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