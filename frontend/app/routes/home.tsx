import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-40" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
            </div>
            <span className="text-sm font-semibold tracking-[0.3em] text-white">
              MONETA AI
            </span>
          </div>

          {/* Login Button */}
          <Link
            to="/login"
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-sm font-medium tracking-wider text-white
              transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
          >
            LOGIN
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-1 items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
            Moneta AI
          </h1>

          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-400">
            Intelligent Monetary Policy Assistant
          </p>

          <p className="mt-6 text-base leading-relaxed text-slate-400 md:text-lg">
            Moneta AI delivers deep insights, structured analysis, and
            intelligent summaries for monetary policy reports. Built for
            economists, analysts, and decision-makers.
          </p>

          {/* CTA */}
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/chat"
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3 text-sm font-semibold tracking-widest text-white
                transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              ACCESS MONETA
            </Link>

            <button
              className="rounded-lg border border-white/15 px-8 py-3 text-sm font-semibold tracking-widest text-white/80
                transition-all hover:border-white/30 hover:bg-white/5"
            >
              LEARN MORE
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="pointer-events-none absolute -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-4 text-center text-xs tracking-widest text-slate-500">
        © 2025 Moneta AI • Monetary Intelligence • Secure • Trusted
      </footer>
    </div>
  );
}
