import { ChevronRight } from "lucide-react";

export default function SettingCard({
  icon,
  title,
  description,
}) {
  return (
    <button
      className="card-glass flex w-full items-center justify-between rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.01]"
    >
      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-card p-3">
          {icon}
        </div>

        <div>

          <h3 className="font-semibold text-primary">
            {title}
          </h3>

          <p className="mt-1 text-sm text-secondary">
            {description}
          </p>

        </div>

      </div>

      <ChevronRight
        size={20}
        className="text-secondary"
      />

    </button>
  );
}