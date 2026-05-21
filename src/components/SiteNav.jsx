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
    <nav className="bg-green" style={{ boxShadow: '0 2px 20px rgba(26,92,56,0.35)' }}>
      {/* Desktop + mobile top bar */}
      <div className="px-6 flex items-center gap-8 h-[68px]">
        <div className="flex items-center gap-2.5 mr-4 flex-shrink-0">
          <a href="https://www.ranchomariagolf.com/" className="flex-shrink-0">
            <img src={logo} alt="Rancho Maria Golf Course" className="h-8 w-auto" />
          </a>
          <NavLink to="/" className="text-gold font-semibold no-underline uppercase">
            <span className="xs:hidden text-xs tracking-wider">RMMC</span>
            <span className="hidden xs:inline text-xs sm:text-sm tracking-widest whitespace-nowrap">Rancho Maria Men's Club</span>
          </NavLink>
        </div>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>Announcements</NavLink>
          <NavLink to="/schedule" className={linkClass}>Schedule</NavLink>
          <NavLink to="/standings" className={linkClass}>Resources</NavLink>
        </div>

        <NavLink to="/admin/login" className="ml-auto hidden sm:block font-sans text-xs text-white/35 hover:text-white/65 transition-colors no-underline">
          Admin
        </NavLink>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden ml-auto text-white/70 hover:text-white transition-colors p-1.5 rounded"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-white/10 py-1">
          <NavLink to="/" end className={mobileLinkClass} onClick={() => setOpen(false)}>Announcements</NavLink>
          <NavLink to="/schedule" className={mobileLinkClass} onClick={() => setOpen(false)}>Schedule</NavLink>
          <NavLink to="/standings" className={mobileLinkClass} onClick={() => setOpen(false)}>Resources</NavLink>
          <div className="border-t border-white/10 mt-1 pt-1">
            <NavLink to="/admin/login" className="font-sans text-sm py-2 px-4 block text-white/35 no-underline" onClick={() => setOpen(false)}>Admin</NavLink>
          </div>
        </div>
      )}
    </nav>
  )
}
