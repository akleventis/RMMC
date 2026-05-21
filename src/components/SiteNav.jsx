import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/rm_logo.png'

export default function SiteNav() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `font-sans text-base pb-0.5 border-b-2 transition-colors no-underline ${
      isActive
        ? 'text-white border-gold'
        : 'text-white/80 border-transparent hover:text-white hover:border-gold'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `font-sans text-sm py-2 px-4 block no-underline transition-colors ${
      isActive ? 'text-gold' : 'text-white/80 hover:text-white'
    }`

  return (
    <nav className="bg-green shadow-md">
      {/* Desktop + mobile top bar */}
      <div className="px-6 flex items-center gap-8 h-[60px]">
        <NavLink to="/" className="text-gold font-bold tracking-wide text-sm sm:text-base no-underline mr-4 flex items-center gap-2">
          <img src={logo} alt="RMMC" className="h-8 w-auto" />
          Rancho Maria Men's Club
        </NavLink>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>Announcements</NavLink>
          <NavLink to="/schedule" className={linkClass}>Schedule</NavLink>
          <NavLink to="/standings" className={linkClass}>Standings</NavLink>
        </div>

        <NavLink to="/admin/login" className="ml-auto hidden sm:block font-sans text-xs text-white/40 hover:text-white/70 transition-colors no-underline">
          Admin
        </NavLink>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden ml-auto text-white/80 hover:text-white p-1"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-white/10 pb-2">
          <NavLink to="/" end className={mobileLinkClass} onClick={() => setOpen(false)}>Announcements</NavLink>
          <NavLink to="/schedule" className={mobileLinkClass} onClick={() => setOpen(false)}>Schedule</NavLink>
          <NavLink to="/standings" className={mobileLinkClass} onClick={() => setOpen(false)}>Standings</NavLink>
          <NavLink to="/admin/login" className="font-sans text-sm py-2 px-4 block text-white/40 no-underline" onClick={() => setOpen(false)}>Admin</NavLink>
        </div>
      )}
    </nav>
  )
}
