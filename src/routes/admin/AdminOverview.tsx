import { useEffect, useState } from 'react'
import { BookOpen, CheckCircle2, ClipboardList, GraduationCap, Percent, Users } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { supabase } from '../../lib/supabaseClient'

interface Stats {
  users: number
  courses: number
  lessons: number
  completions: number
  quizAttempts: number
  averageScorePercent: number
}

const tiles: Array<{
  key: keyof Stats
  label: string
  icon: typeof Users
  suffix?: string
}> = [
  { key: 'users', label: 'المستخدمون', icon: Users },
  { key: 'courses', label: 'الدورات', icon: BookOpen },
  { key: 'lessons', label: 'الدروس', icon: GraduationCap },
  { key: 'completions', label: 'دروس مكتملة', icon: CheckCircle2 },
  { key: 'quizAttempts', label: 'محاولات الاختبارات', icon: ClipboardList },
  { key: 'averageScorePercent', label: 'متوسط النتائج', icon: Percent, suffix: '%' },
]

export function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [
          { count: users },
          { count: courses },
          { count: lessons },
          { count: completions },
          { data: attempts },
        ] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('courses').select('id', { count: 'exact', head: true }),
          supabase.from('lessons').select('id', { count: 'exact', head: true }),
          supabase.from('lesson_progress').select('id', { count: 'exact', head: true }),
          supabase.from('quiz_attempts').select('score, total'),
        ])

        const totalScore = (attempts ?? []).reduce((sum, a) => sum + a.score, 0)
        const totalPossible = (attempts ?? []).reduce((sum, a) => sum + a.total, 0)
        const averageScorePercent = totalPossible ? Math.round((totalScore / totalPossible) * 100) : 0

        setStats({
          users: users ?? 0,
          courses: courses ?? 0,
          lessons: lessons ?? 0,
          completions: completions ?? 0,
          quizAttempts: attempts?.length ?? 0,
          averageScorePercent,
        })
      } catch {
        setStats({ users: 0, courses: 0, lessons: 0, completions: 0, quizAttempts: 0, averageScorePercent: 0 })
      }
    }
    void load()
  }, [])

  return (
    <div>
      <h1 className="font-extrabold text-xl text-text-primary mb-5">نظرة عامة</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map(({ key, label, icon: Icon, suffix }) => (
          <Card key={key} className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
              <Icon size={20} />
            </div>
            <div>
              <p className="font-extrabold text-2xl text-text-primary">
                {stats ? stats[key] : '—'}
                {suffix && stats ? suffix : ''}
              </p>
              <p className="text-xs text-text-muted">{label}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
