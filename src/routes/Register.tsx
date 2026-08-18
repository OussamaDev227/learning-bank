import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuth } from '../lib/auth'

export function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signUp(email, password, fullName)
    setLoading(false)
    if (error) setError(error)
    else navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-page px-4">
      <Card className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Logo size={56} />
          <h1 className="font-extrabold text-lg mt-3 text-text-primary">إنشاء حساب جديد</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            required
            placeholder="الاسم الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary-300"
          />
          <input
            type="email"
            required
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary-300"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary-300"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'جارِ الإنشاء...' : 'إنشاء الحساب'}
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted mt-4">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="text-primary-600 font-bold">
            تسجيل الدخول
          </Link>
        </p>
      </Card>
    </div>
  )
}
