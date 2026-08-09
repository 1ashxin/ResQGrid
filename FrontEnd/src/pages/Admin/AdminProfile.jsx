import AdminSidebar from "../../components/AdminSidebar";

function AdminProfile() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      <AdminSidebar />

      <main className="ml-64 p-8">

        <p className="text-sm text-gray-400">
          Account
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Admin Profile
        </h1>

        <p className="mt-2 text-gray-400">
          Manage your command center account.
        </p>


        <div className="mt-8 max-w-2xl rounded-2xl border border-white/10 bg-[#0d1b2a] p-8">

          <div className="flex items-center gap-5">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-3xl">
              👤
            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                Disaster Administrator
              </h2>

              <p className="mt-1 text-gray-400">
                ResQGrid Command Center
              </p>
            </div>

          </div>


          <div className="mt-8 space-y-5">

            <div>
              <label className="text-sm text-gray-400">
                Name
              </label>

              <input
                value="Disaster Administrator"
                readOnly
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
              />
            </div>


            <div>
              <label className="text-sm text-gray-400">
                Role
              </label>

              <input
                value="System Administrator"
                readOnly
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
              />
            </div>


            <div>
              <label className="text-sm text-gray-400">
                Access Level
              </label>

              <input
                value="Emergency Operations"
                readOnly
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
              />
            </div>


            <button className="w-full rounded-xl bg-red-500 px-5 py-3 font-semibold hover:bg-red-600">
              Logout
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminProfile;