import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";

const styles = {
  success: {
    icon: CheckCircle2,
    border: "border-emerald-400/30",
    bg: "bg-emerald-500/15",
    iconColor: "text-emerald-300",
  },
  info: {
    icon: Info,
    border: "border-sky-400/30",
    bg: "bg-sky-500/15",
    iconColor: "text-sky-300",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-400/30",
    bg: "bg-amber-500/15",
    iconColor: "text-amber-300",
  },
  error: {
    icon: XCircle,
    border: "border-red-400/30",
    bg: "bg-red-500/15",
    iconColor: "text-red-300",
  },
};

export default function Toast({ message, type = "info" }) {
  const current = styles[type] || styles.info;
  const Icon = current.icon;

  return (
    <div
      className={`
        flex items-center gap-4
        rounded-2xl
        border
        ${current.border}
        ${current.bg}
        px-5
        py-4
        backdrop-blur-xl
        shadow-2xl
        animate-[toastIn_.35s_ease]
      `}
    >
      <Icon
        size={22}
        className={current.iconColor}
      />

      <p className="font-medium text-white">
        {message}
      </p>
    </div>
  );
}