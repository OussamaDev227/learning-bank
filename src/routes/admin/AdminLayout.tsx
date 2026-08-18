import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Menu, Undo2, Users, BookOpen, BookOpenCheck, X } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { useAuth } from '../../lib/auth'

const navItems = [
  { label: 'نظرة عامة', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'الدورات والدروس', to: '/admin/courses', icon: BookOpen, end: false },
  { label: 'القاموس الذكي', to: '/admin/dictionary', icon: BookOpenCheck, end: false },
  { label: 'المستخدمون', to: '/admin/users', icon: Users, end: false },
]

export function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen lg:flex bg-page">
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-footer-navy text-white px-4 py-3">
        <button onClick={() => setMobileOpen(true)} aria-label="فتح القائمة">
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-extrabold text-sm">لوحة التحكم</span>
        </div>
        <div className="w-[22px]" />
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 inset-y-0 lg:inset-y-auto right-0 lg:top-0 h-screen w-64 shrink-0 bg-footer-navy text-white flex flex-col z-50 transition-transform lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Logo size={36} />
            <div className="leading-tight">
              <p className="font-extrabold text-sm">لوحة التحكم</p>
              <p className="text-[11px] text-white/60">بنك علوم اللغة العربية</p>
            </div>
          </div>
          <button className="lg:hidden text-white/70" onClick={() => setMobileOpen(false)} aria-label="إغلاق القائمة">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                  isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <p className="px-3 text-xs text-white/60 mb-2 truncate">
            {profile?.full_name ?? profile?.email}
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white/70 hover:bg-white/10"
          >
            <Undo2 size={17} />
            العودة إلى الموقع
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white/70 hover:bg-white/10"
          >
            <LogOut size={17} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
