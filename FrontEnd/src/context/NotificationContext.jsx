import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  function showToast(message, type = "info") {
    const id = Date.now();

    setNotifications((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((toast) => toast.id !== id)
      );
    }, 3500);
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}