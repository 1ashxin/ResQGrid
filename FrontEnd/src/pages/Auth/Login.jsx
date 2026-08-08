import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (
      email === "admin@resqgrid.com" &&
      password === "admin123"
    ) {
      login();
      navigate("/admin");
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#35506D] via-[#314B67] to-[#223449] flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-2xl">

        <div className="flex justify-center">

          <div className="rounded-full bg-sky-500/20 p-5">

            <Shield
              size={42}
              className="text-sky-300"
            />

          </div>

        </div>

        <h1 className="mt-6 text-center text-4xl font-bold text-white">
          Admin Login
        </h1>

        <p className="mt-2 text-center text-slate-300">
          Sign in to access the ResQGrid Command Center
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-10 space-y-6"
        >

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none focus:border-sky-400"
            />

          </div>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none focus:border-sky-400"
            />

          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#FF6B6B] py-4 font-semibold text-white transition hover:bg-[#ff8080]"
          >
            Sign In
          </button>

        </form>

        <div className="mt-8 rounded-2xl bg-white/5 p-4 text-sm text-slate-300">

          <p className="font-semibold text-white">
            Demo Credentials
          </p>

          <p className="mt-2">
            Email: admin@resqgrid.com
          </p>

          <p>
            Password: admin123
          </p>

        </div>

      </div>

    </main>
  );
}