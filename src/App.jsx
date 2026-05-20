import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SiteNav from './components/SiteNav'
import AdminGuard from './components/AdminGuard'

import Home from './pages/Home'
import Schedule from './pages/Schedule'
import Standings from './pages/Standings'

import Login from './pages/admin/Login'
import AdminLayout from './pages/admin/AdminLayout'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminSchedule from './pages/admin/AdminSchedule'
import AdminStandings from './pages/admin/AdminStandings'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-cream">
      <SiteNav />
      {children}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/schedule" element={<PublicLayout><Schedule /></PublicLayout>} />
        <Route path="/standings" element={<PublicLayout><Standings /></PublicLayout>} />

        {/* Admin login (no guard) */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected admin */}
        <Route
          path="/admin"
          element={<AdminGuard><AdminLayout /></AdminGuard>}
        >
          <Route index element={<Navigate to="announcements" replace />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="schedule" element={<AdminSchedule />} />
          <Route path="standings" element={<AdminStandings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
