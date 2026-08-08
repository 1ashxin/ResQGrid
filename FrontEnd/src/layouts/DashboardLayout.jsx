import DashboardNavbar from "./DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <main className="min-h-screen bg-[#223449] text-white">
      <DashboardNavbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {children}
      </div>
    </main>
  );
}