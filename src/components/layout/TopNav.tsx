import { Bell, Globe, LayoutDashboard, Search, User } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { Logo } from '../Logo'
import { Button } from '../ui/Button'
import { useAuth } from '../../lib/auth'

const navItems = [
  { label: 'تعلم العربية', to: '/learn', active: true },
  { label: 'البنوك الغنية', to: '/banks', active: true },
  { label: 'المكتبة الرقمية', to: '/library', active: true },
  { label: 'الأكاديمية', to: '#', active: false },
  { label: 'المساعد الذكي', to: '#', active: false },
]

export function TopNav() {
  const { session, profile } = useAuth()

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-primary-100">
      <div className="mx-auto max-w-[1400px] flex items-center gap-6 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Logo size={36} />
          <div className="leading-tight">
            <p className="font-extrabold text-primary-900 text-xs sm:text-sm">بنك علوم اللغة العربية</p>
            <p className="text-[10px] sm:text-[11px] text-text-muted">التعليمي</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 shrink-0">
          {navItems.map((item) =>
            item.active ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-bold pb-1 border-b-2 transition-colors ${
                    isActive
                      ? 'text-primary-600 border-primary-600'
                      : 'text-text-primary border-transparent hover:text-primary-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.label}
                className="text-sm font-bold text-text-muted/60 cursor-not-allowed"
                title="قريباً"
              >
                {item.label}
              </span>
            )
          )}
        </nav>

        <div className="hidden sm:flex flex-1 min-w-0 items-center bg-page rounded-full px-4 py-2 max-w-md">
          <Search size={18} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="إبحث في الدروس، القواعد، الكتب..."
            className="bg-transparent outline-none px-2 text-sm w-full min-w-0 placeholder:text-text-muted"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ms-auto sm:ms-0">
          <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-100">
            <Bell size={16} />
          </button>
          <button className="hidden sm:flex w-9 h-9 rounded-full bg-primary-50 items-center justify-center text-primary-600 hover:bg-primary-100">
            <Globe size={17} />
          </button>

          {session ? (
            <>
              {profile?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="w-9 h-9 rounded-full bg-footer-navy flex items-center justify-center text-white hover:opacity-90"
                  title="لوحة التحكم"
                >
                  <LayoutDashboard size={16} />
                </Link>
              )}
              <Link
                to="/profile"
                className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white"
                title={profile?.full_name ?? 'الملف الشخصي'}
              >
                <User size={17} />
              </Link>
            </>
          ) : (
            <Link to="/login">
              <Button className="whitespace-nowrap !px-3 sm:!px-6 !text-xs sm:!text-sm">تسجيل الدخول</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
