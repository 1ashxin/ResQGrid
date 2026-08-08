import Toast from "./Toast";
import { useNotification } from "../../context/NotificationContext";

export default function ToastContainer() {
  const { notifications } = useNotification();

  return (
    <div className="fixed right-6 top-6 z-[9999] flex w-[360px] flex-col gap-4">

      {notifications.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
        />
      ))}

    </div>
  );
}