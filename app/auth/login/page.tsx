'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Droplets, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  // Demo credentials
  const DEMO_USERS = [
    { email: 'admin@chicowater.com', password: 'admin123', role: 'admin', redirect: '/dashboard/admin' },
    { email: 'sales@chicowater.com', password: 'sales123', role: 'salesperson', redirect: '/dashboard/sales' },
    { email: 'customer@chicowater.com', password: 'customer123', role: 'customer', redirect: '/dashboard/customer' },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const user = DEMO_USERS.find(u => u.email === form.email && u.password === form.password)
    if (user) {
      toast.success(`Welcome back!`)
      localStorage.setItem('chico_user', JSON.stringify({ email: user.email, role: user.role }))
      router.push(user.redirect)
    } else {
      toast.error('Invalid credentials. Try the demo accounts below.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-900 via-water-800 to-water-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Droplets className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-xl">Chico Water</div>
              <div className="text-water-200 text-xs font-medium uppercase tracking-widest">Limited</div>
            </div>
          </Link>
          <p className="text-white/60 text-sm mt-4">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-gray-900 mb-6">Welcome back</h1>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input pl-10 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-60"
            >
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</> : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Demo accounts</p>
            <div className="space-y-2">
              {[
                { label: 'Admin', email: 'admin@chicowater.com', pass: 'admin123' },
                { label: 'Salesperson', email: 'sales@chicowater.com', pass: 'sales123' },
                { label: 'Customer', email: 'customer@chicowater.com', pass: 'customer123' },
              ].map(d => (
                <button
                  key={d.email}
                  onClick={() => setForm({ email: d.email, password: d.pass })}
                  className="w-full text-left flex items-center justify-between py-2 px-3 bg-white rounded-xl border border-gray-100 hover:border-water-300 transition-colors"
                >
                  <div>
                    <span className="text-xs font-bold text-water-600">{d.label}</span>
                    <span className="text-xs text-gray-500 ml-2">{d.email}</span>
                  </div>
                  <span className="text-xs text-gray-400">click to fill</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              New customer?{' '}
              <Link href="/auth/register" className="text-water-600 font-semibold hover:underline">Create account</Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-white/50 text-sm hover:text-white/80 transition-colors">← Back to website</Link>
        </div>
      </div>
    </div>
  )
}
