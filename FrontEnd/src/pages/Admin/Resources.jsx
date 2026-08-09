import AdminSidebar from "../../components/AdminSidebar";

const resources = [
  {
    name: "Drinking Water",
    category: "Essential",
    stock: 820,
    unit: "litres",
    status: "Healthy",
  },
  {
    name: "Food Packets",
    category: "Food",
    stock: 420,
    unit: "packets",
    status: "Healthy",
  },
  {
    name: "Medical Kits",
    category: "Medical",
    stock: 48,
    unit: "kits",
    status: "Low Stock",
  },
  {
    name: "Blankets",
    category: "Relief",
    stock: 73,
    unit: "pieces",
    status: "Low Stock",
  },
  {
    name: "First Aid Kits",
    category: "Medical",
    stock: 125,
    unit: "kits",
    status: "Healthy",
  },
];

function Resources() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      <AdminSidebar />

      <main className="ml-64 p-8">

        <p className="text-sm text-gray-400">
          Relief Management
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Resources
        </h1>

        <p className="mt-2 text-gray-400">
          Track relief supplies and identify shortages.
        </p>


        <div className="mt-8 grid grid-cols-3 gap-5">

          <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">
            <p className="text-gray-400">
              Resource Types
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              18
            </h2>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
            <p className="text-gray-400">
              Healthy Stock
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-400">
              13
            </h2>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-gray-400">
              Low Stock
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-400">
              5
            </h2>
          </div>

        </div>


        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0d1b2a] p-6">

          <h2 className="text-xl font-semibold">
            Inventory
          </h2>

          <div className="mt-5 overflow-hidden rounded-xl border border-white/10">

            <table className="w-full text-left">

              <thead className="bg-white/5 text-sm text-gray-400">

                <tr>
                  <th className="px-5 py-4">Resource</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Status</th>
                </tr>

              </thead>

              <tbody className="divide-y divide-white/10">

                {resources.map((resource) => (

                  <tr key={resource.name}>

                    <td className="px-5 py-4 font-medium">
                      {resource.name}
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {resource.category}
                    </td>

                    <td className="px-5 py-4">
                      {resource.stock} {resource.unit}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={
                          resource.status === "Healthy"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        ● {resource.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Resources;