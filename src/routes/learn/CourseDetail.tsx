import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Circle } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../lib/auth'
import type { Course, Lesson } from '../../types/domain'

export function CourseDetail() {
  const { courseId } = useParams()
  const { session } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!courseId) return

    async function load() {
      try {
        const [{ data: courseData }, { data: lessonData }] = await Promise.all([
          supabase.from('courses').select('*').eq('id', courseId).single(),
          supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .eq('is_published', true)
            .order('order_index', { ascending: true }),
        ])

        setCourse(courseData as Course)
        setLessons((lessonData as Lesson[]) ?? [])

        if (session) {
          const { data: progress } = await supabase
            .from('lesson_progress')
            .select('lesson_id')
            .eq('user_id', session.user.id)
          setCompletedIds(new Set((progress ?? []).map((p) => p.lesson_id)))
        }
      } catch {
        setCourse(null)
        setLessons([])
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [courseId, session])

  if (loading) return <p className="text-sm text-text-muted">جارِ التحميل...</p>
  if (!course) return <p className="text-sm text-text-muted">لم يتم العثور على الدورة.</p>

  return (
    <div>
      <h1 className="font-extrabold text-xl text-text-primary mb-1">{course.title}</h1>
      {course.description && <p className="text-sm text-text-muted mb-5">{course.description}</p>}

      <div className="space-y-2">
        {lessons.map((l, i) => {
          const done = completedIds.has(l.id)
          return (
            <Link key={l.id} to={`/learn/${courseId}/${l.id}`}>
              <Card className="flex items-center gap-3 py-3">
                {done ? (
                  <CheckCircle2 size={20} className="text-primary-600 shrink-0" />
                ) : (
                  <Circle size={20} className="text-text-muted shrink-0" />
                )}
                <span className="text-xs text-text-muted w-6">{i + 1}.</span>
                <span className="text-sm font-medium text-text-primary flex-1">{l.title}</span>
              </Card>
            </Link>
          )
        })}
        {lessons.length === 0 && (
          <p className="text-sm text-text-muted">لا توجد دروس في هذه الدورة بعد.</p>
        )}
      </div>
    </div>
  )
}
