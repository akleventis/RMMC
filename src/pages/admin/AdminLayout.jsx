import { NavLink, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  const linkClass = ({ isActive }) =>
    `font-sans text-sm py-1 border-b-2 transition-colors no-underline whitespace-nowrap ${
      isActive
        ? 'text-white border-gold'
        : 'text-white/70 border-transparent hover:text-white hover:border-gold'
    }`

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-gray-900 px-4 sm:px-8">
        <div className="flex items-center gap-5 sm:gap-8 h-12 overflow-x-auto border-b border-white/10">
          <span className="text-gold font-bold text-sm tracking-widest font-sans shrink-0">
            RMMC ADMIN
          </span>
          <NavLink to="/" className="font-sans text-xs text-white/50 hover:text-white/80 transition-colors no-underline whitespace-nowrap">
            ← Return to Website
          </NavLink>
          <NavLink to="/admin/announcements" className={linkClass}>Announcements</NavLink>
          <NavLink to="/admin/schedule" className={linkClass}>Schedule</NavLink>
          <NavLink to="/admin/standings" className={linkClass}>Resources</NavLink>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
