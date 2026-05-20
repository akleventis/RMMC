import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminLayout() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/', { replace: true })
  }

  const linkClass = ({ isActive }) =>
    `font-sans text-sm py-1 border-b-2 transition-colors no-underline whitespace-nowrap ${
      isActive
        ? 'text-white border-gold'
        : 'text-white/70 border-transparent hover:text-white hover:border-gold'
    }`

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-gray-900 px-4 sm:px-8">
        {/* Row 1: brand + logout */}
        <div className="flex items-center justify-between h-12 border-b border-white/10">
          <span className="text-gold font-bold text-sm tracking-widest font-sans">
            RMMC ADMIN
          </span>
          <button
            onClick={handleLogout}
            className="font-sans text-sm text-white bg-red-700 hover:bg-red-600 px-4 py-1.5 rounded transition-colors"
          >
            Log Out
          </button>
        </div>
        {/* Row 2: nav links */}
        <div className="flex items-center gap-5 sm:gap-8 h-11 overflow-x-auto">
          <NavLink to="/" className="font-sans text-xs text-white/50 hover:text-white/80 transition-colors no-underline whitespace-nowrap">
            ← Return to Website
          </NavLink>
          <NavLink to="/admin/announcements" className={linkClass}>Announcements</NavLink>
          <NavLink to="/admin/schedule" className={linkClass}>Schedule</NavLink>
          <NavLink to="/admin/standings" className={linkClass}>Standings</NavLink>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
