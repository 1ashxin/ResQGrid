export default function StatCard({
  number,
  title,
}) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 text-center shadow-lg">
      <h2 className="text-4xl font-bold text-red-500">
        {number}
      </h2>

      <p className="text-slate-300 mt-2">
        {title}
      </p>
    </div>
  );
}