import {
  AlertTriangle,
  CheckCircle,
  Bell,
  Package,
} from "lucide-react";

export default function NotificationCard({
  title,
  description,
  time,
  type,
  unread,
}) {

  function getIcon() {

    switch (type) {

      case "danger":
        return <AlertTriangle className="text-danger" size={22} />;

      case "success":
        return <CheckCircle className="text-success" size={22} />;

      case "warning":
        return <Package className="text-warning" size={22} />;

      default:
        return <Bell className="text-brand" size={22} />;

    }

  }

  return (

    <div className="card-glass rounded-2xl p-5 transition hover:scale-[1.01]">

      <div className="flex items-start justify-between">

        <div className="flex gap-4">

          {getIcon()}

          <div>

            <div className="flex items-center gap-2">

              <h3 className="font-semibold text-primary">
                {title}
              </h3>

              {unread && (
                <span className="h-2.5 w-2.5 rounded-full bg-danger"></span>
              )}

            </div>

            <p className="mt-2 text-secondary">
              {description}
            </p>

          </div>

        </div>

        <span className="text-sm text-secondary">
          {time}
        </span>

      </div>

    </div>

  );
}