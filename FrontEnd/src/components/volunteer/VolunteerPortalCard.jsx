import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function VolunteerPortalCard({
  icon: Icon,
  title,
  description,
  features,
  buttonText,
  to,
}) {
  return (
    <div className="card-glass rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card">
        <Icon
          size={34}
          className="text-brand"
        />
      </div>

      <h2 className="mt-6 text-3xl font-bold text-primary">
        {title}
      </h2>

      <p className="mt-4 leading-7 text-secondary">
        {description}
      </p>

      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-3 text-secondary"
          >
            <span className="h-2 w-2 rounded-full bg-brand"></span>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        to={to}
        className="btn-primary mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition-all duration-300 hover:-translate-y-1"
      >
        {buttonText}

        <ArrowRight size={18} />
      </Link>

    </div>
  );
}