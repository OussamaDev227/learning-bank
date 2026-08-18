import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../lib/auth'
import type { Profile } from '../../types/domain'

export function UsersManager() {
  const { profile: currentProfile } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function loadUsers() {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      setUsers((data as Profile[]) ?? [])
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  async function toggleRole(user: Profile) {
    const nextRole = user.role === 'admin' ? 'student' : 'admin'
    setUpdatingId(user.id)
    await supabase.from('profiles').update({ role: nextRole }).eq('id', user.id)
    await loadUsers()
    setUpdatingId(null)
  }

  return (
    <div>
      <h1 className="font-extrabold text-xl text-text-primary mb-5">المستخدمون</h1>

      {loading ? (
        <p className="text-sm text-text-muted">جارِ التحميل...</p>
      ) : (
        <div className="space-y-2">
          {users.map((u) => {
            const isSelf = u.id === currentProfile?.id
            return (
              <Card key={u.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-text-primary">{u.full_name ?? 'بلا اسم'}</p>
                  <p className="text-xs text-text-muted truncate">{u.email}</p>
                </div>
                <Badge className={u.role === 'admin' ? '!bg-accent-gold/20 !text-accent-gold' : ''}>
                  {u.role === 'admin' ? 'مسؤول' : 'متعلم'}
                </Badge>
                <button
                  onClick={() => toggleRole(u)}
                  disabled={isSelf || updatingId === u.id}
                  title={isSelf ? 'لا يمكنك تغيير دورك الخاص' : undefined}
                  className="text-xs font-bold text-primary-600 disabled:text-text-muted disabled:cursor-not-allowed px-3 py-1.5 rounded-full hover:bg-primary-50 disabled:hover:bg-transparent"
                >
                  {u.role === 'admin' ? 'إلغاء صلاحية المسؤول' : 'ترقية إلى مسؤول'}
                </button>
              </Card>
            )
          })}
          {users.length === 0 && <p className="text-sm text-text-muted">لا يوجد مستخدمون بعد.</p>}
        </div>
      )}
    </div>
  )
}
