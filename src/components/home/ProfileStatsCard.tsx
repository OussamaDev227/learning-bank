import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { ProgressRing } from '../ui/ProgressRing'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabaseClient'

interface Stats {
  lessons: number
  quizzes: number
  points: number
  percent: number
  level: string
}

function levelFromPercent(percent: number) {
  if (percent >= 70) return 'متمكن'
  if (percent >= 30) return 'متوسط'
  return 'مبتدئ'
}

export function ProfileStatsCard() {
  const { session, profile } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (!session) return

    async function loadStats() {
      const userId = session!.user.id

      try {
        const [{ count: lessonCount }, { count: totalLessons }, { data: attempts }] =
          await Promise.all([
            supabase
              .from('lesson_progress')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', userId),
            supabase
              .from('lessons')
              .select('id', { count: 'exact', head: true })
              .eq('is_published', true),
            supabase.from('quiz_attempts').select('score').eq('user_id', userId),
          ])

        const points = (attempts ?? []).reduce((sum, a) => sum + (a.score ?? 0), 0)
        const percent = totalLessons ? Math.round(((lessonCount ?? 0) / totalLessons) * 100) : 0

        setStats({
          lessons: lessonCount ?? 0,
          quizzes: attempts?.length ?? 0,
          points,
          percent,
          level: levelFromPercent(percent),
        })
      } catch {
        setStats({ lessons: 0, quizzes: 0, points: 0, percent: 0, level: 'مبتدئ' })
      }
    }

    void loadStats()
  }, [session])

  if (!session) {
    return (
      <Card className="text-center">
        <p className="font-extrabold text-text-primary mb-2">مرحباً بك</p>
        <p className="text-sm text-text-muted mb-4">سجّل الدخول لمتابعة تقدمك في تعلم العربية</p>
        <Link to="/login">
          <Button className="w-full">تسجيل الدخول</Button>
        </Link>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-extrabold text-text-primary">مرحباً بك</p>
          <p className="text-xs text-text-muted">{profile?.full_name ?? 'متعلم'}</p>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-bold text-accent-gold">
          <Sparkles size={12} /> متعلم مميز
        </span>
      </div>

      <div className="flex items-center gap-3 bg-page rounded-xl p-3 mb-4">
        <ProgressRing percent={stats?.percent ?? 0} size={56} />
        <div>
          <p className="text-xs text-text-muted">مستواك الحالي</p>
          <p className="font-extrabold text-sm text-primary-700">{stats?.level ?? 'مبتدئ'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-4">
        <div>
          <p className="font-extrabold text-lg text-text-primary">{stats?.lessons ?? 0}</p>
          <p className="text-[10px] text-text-muted">دروس</p>
        </div>
        <div>
          <p className="font-extrabold text-lg text-text-primary">{stats?.quizzes ?? 0}</p>
          <p className="text-[10px] text-text-muted">اختبارات</p>
        </div>
        <div>
          <p className="font-extrabold text-lg text-text-primary">{stats?.points ?? 0}</p>
          <p className="text-[10px] text-text-muted">نقاط</p>
        </div>
      </div>

      <Link to="/learn">
        <Button className="w-full">متابعة التعلم</Button>
      </Link>
    </Card>
  )
}
