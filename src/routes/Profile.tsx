import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProfileStatsCard } from '../components/home/ProfileStatsCard'
import { useAuth } from '../lib/auth'

export function Profile() {
  const { profile, session, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card>
        <p className="font-extrabold text-text-primary">{profile?.full_name ?? 'متعلم'}</p>
        <p className="text-xs text-text-muted">{session?.user.email}</p>
        <p className="text-xs text-text-muted mt-1">
          الدور: {profile?.role === 'admin' ? 'مسؤول المنصة' : 'متعلم'}
        </p>
        <Button variant="outline" className="w-full mt-4" onClick={handleSignOut}>
          تسجيل الخروج
        </Button>
      </Card>

      <ProfileStatsCard />
    </div>
  )
}
