import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlayCircle } from 'lucide-react'
import { Card } from '../ui/Card'
import { supabase } from '../../lib/supabaseClient'

interface LessonRow {
  id: string
  title: string
  course_id: string
}

export function LatestLessonsList() {
  const [lessons, setLessons] = useState<LessonRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('lessons')
          .select('id, title, course_id')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(3)
        setLessons(data ?? [])
      } catch {
        setLessons([])
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="font-extrabold text-sm text-text-primary">أحدث الدروس</p>
        <Link to="/learn" className="text-primary-600 text-xs font-bold">
          عرض الكل
        </Link>
      </div>

      {loading ? (
        <p className="text-xs text-text-muted">جارِ التحميل...</p>
      ) : lessons.length === 0 ? (
        <p className="text-xs text-text-muted">لا توجد دروس منشورة بعد.</p>
      ) : (
        <ul className="space-y-2">
          {lessons.map((l) => (
            <li key={l.id}>
              <Link
                to={`/learn/${l.course_id}/${l.id}`}
                className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-page transition-colors"
              >
                <PlayCircle size={16} className="text-primary-600 shrink-0" />
                <span className="text-xs font-medium text-text-primary line-clamp-1">
                  {l.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
