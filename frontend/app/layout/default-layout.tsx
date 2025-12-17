import { Outlet } from "react-router"

export default function AppLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-black" />

      {/* Subtle futuristic grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient glow accents */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      {/* Optional scanline effect */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full bg-[linear-gradient(to_bottom,transparent_95%,rgba(255,255,255,0.05)_100%)] bg-[length:100%_4px]" />
      </div>

      {/* Page content */}
      <div className="relative z-10 min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}
