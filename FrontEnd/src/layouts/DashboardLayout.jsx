import DashboardNavbar from "./DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <main className="min-h-screen bg-primary text-primary">

      <DashboardNavbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {children}
      </div>

    </main>
  );
}