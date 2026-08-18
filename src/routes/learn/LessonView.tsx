import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { CheckCircle2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../lib/auth'
import type { Lesson, Quiz } from '../../types/domain'

export function LessonView() {
  const { courseId, lessonId } = useParams()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [completed, setCompleted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    if (!lessonId) return

    async function load() {
      try {
        const { data: lessonData } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single()
        setLesson(lessonData as Lesson)

        const { data: quizData } = await supabase
          .from('quizzes')
          .select('*')
          .eq('lesson_id', lessonId)
          .maybeSingle()
        setQuiz(quizData as Quiz | null)

        if (session) {
          const { data: progress } = await supabase
            .from('lesson_progress')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('lesson_id', lessonId)
            .maybeSingle()
          setCompleted(!!progress)
        }
      } catch {
        setLoadFailed(true)
      }
    }
    void load()
  }, [lessonId, session])

  async function markComplete() {
    if (!session || !lessonId) return navigate('/login')
    setSaving(true)
    await supabase
      .from('lesson_progress')
      .upsert({ user_id: session.user.id, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' })
    setCompleted(true)
    setSaving(false)
  }

  if (loadFailed) return <p className="text-sm text-text-muted">تعذّر تحميل الدرس. حاول مرة أخرى لاحقاً.</p>
  if (!lesson) return <p className="text-sm text-text-muted">جارِ التحميل...</p>

  return (
    <div>
      <Link to={`/learn/${courseId}`} className="text-xs text-primary-600 font-bold">
        &lt; رجوع إلى الدورة
      </Link>

      <h1 className="font-extrabold text-xl text-text-primary mt-2 mb-4">{lesson.title}</h1>

      <Card className="prose prose-sm max-w-none mb-5">
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        {completed ? (
          <span className="flex items-center gap-1.5 text-primary-600 text-sm font-bold">
            <CheckCircle2 size={18} /> تم إكمال الدرس
          </span>
        ) : (
          <Button onClick={markComplete} disabled={saving}>
            {saving ? 'جارِ الحفظ...' : 'إكمال الدرس'}
          </Button>
        )}

        {quiz && (
          <Link to={`/learn/${courseId}/${lessonId}/quiz`}>
            <Button variant="outline">ابدأ الاختبار</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
