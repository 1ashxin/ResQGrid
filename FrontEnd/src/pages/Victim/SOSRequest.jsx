import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { useRequest } from "../../context/RequestContext";

export default function SOSRequest() {
  const navigate = useNavigate();

  const {
    setRequestStatus,
    setRequestData,
  } = useRequest();

  const { showToast } = useNotification();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    people: "",
    emergency: "",
    notes: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    setRequestData(form);
    setRequestStatus("searching");

    showToast("Emergency request submitted successfully!", 
              "success"
    );

    setTimeout(() => {
      showToast("Searching for nearby responders...",
        "info"
      );
    }, 700);

    navigate("/victim");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#35506D] via-[#314B67] to-[#223449] px-6 py-10 text-white">

      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-300 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

          <h1 className="text-4xl font-bold">
            Emergency Assistance Request
          </h1>

          <p className="mt-3 text-slate-300">
            Fill in the details below so nearby volunteers can assist you.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
              required
            />

            <input
              name="location"
              placeholder="Current Location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
              required
            />

            <input
              type="number"
              name="people"
              placeholder="People Requiring Help"
              value={form.people}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
            />

            <select
              name="emergency"
              value={form.emergency}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-sky-400"
              required
            >
              <option value="" className="bg-[#223449] text-white">
                Select Emergency
              </option>

              <option value="Medical" className="bg-[#223449] text-white">
                Medical
              </option>

              <option value="Flood" className="bg-[#223449] text-white">
                Flood
              </option>

              <option value="Fire" className="bg-[#223449] text-white">
                Fire
              </option>

              <option value="Earthquake" className="bg-[#223449] text-white">
                Earthquake
              </option>

              <option value="Food & Water" className="bg-[#223449] text-white">
                Food & Water
              </option>

              <option value="Shelter Needed" className="bg-[#223449] text-white">
  Shelter Needed
              </option>
            </select>

            <textarea
              name="notes"
              placeholder="Additional Information"
              value={form.notes}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
            />

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#FF6B6B] py-4 text-lg font-semibold transition hover:bg-[#ff7d7d]"
            >
              Submit Emergency Request
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}