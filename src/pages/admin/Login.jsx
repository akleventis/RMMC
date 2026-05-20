import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/announcements', { replace: true })
    })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) {
      setError('Invalid email or password. Please try again.')
    } else {
      navigate('/admin/announcements', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-green flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl px-8 py-10 w-full max-w-sm">
        <Link to="/" className="font-sans text-sm text-muted hover:text-green transition-colors no-underline block mb-5">
          ← Return to Website
        </Link>
        <h1 className="font-serif text-green text-2xl mb-1">RMMC Admin</h1>
        <p className="font-sans text-muted text-base mb-7">Sign in to manage content</p>

        {error && (
          <div className="bg-red-100 text-red-800 text-base font-sans px-4 py-3 rounded mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block font-sans text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 font-sans text-base focus:outline-none focus:border-green"
            />
          </div>
          <div>
            <label className="block font-sans text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 font-sans text-base focus:outline-none focus:border-green pr-20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-sans text-sm text-muted hover:text-gray-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green hover:bg-green-light text-white font-sans text-base py-3 rounded-lg mt-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
