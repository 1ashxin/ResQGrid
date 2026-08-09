import {
  MapPin,
  User,
  Shield,
  Building2,
} from "lucide-react";

export default function SearchResultCard({
  name,
  role,
  location,
  status,
}) {

  function getIcon() {

    switch (role.toLowerCase()) {

      case "victim":
        return <Shield className="text-danger" size={22} />;

      case "ngo":
        return <Building2 className="text-brand" size={22} />;

      default:
        return <User className="text-success" size={22} />;

    }

  }

  return (

    <div className="card-glass rounded-2xl p-5 transition hover:scale-[1.01]">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          {getIcon()}

          <div>

            <h3 className="font-semibold text-primary">
              {name}
            </h3>

            <p className="text-secondary">
              {role}
            </p>

          </div>

        </div>

        <span className="rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
          {status}
        </span>

      </div>

      <div className="mt-4 flex items-center gap-2 text-secondary">

        <MapPin size={18} />

        {location}

      </div>

    </div>

  );
}