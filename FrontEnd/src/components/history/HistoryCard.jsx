import {
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function HistoryCard({
  title,
  description,
  date,
  status,
}) {

  function getStatusIcon() {

    switch (status.toLowerCase()) {

      case "completed":
        return <CheckCircle2 className="text-success" size={20} />;

      case "pending":
        return <Clock3 className="text-warning" size={20} />;

      default:
        return <AlertTriangle className="text-danger" size={20} />;

    }

  }

  return (

    <div className="card-glass rounded-2xl p-5 transition hover:scale-[1.01]">

      <div className="flex justify-between">

        <div>

          <h3 className="font-semibold text-primary">
            {title}
          </h3>

          <p className="mt-2 text-secondary">
            {description}
          </p>

        </div>

        {getStatusIcon()}

      </div>

      <div className="mt-4 flex justify-between text-sm text-secondary">

        <span>{date}</span>

        <span>{status}</span>

      </div>

    </div>

  );
}