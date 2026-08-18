import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabaseClient'
import type { Lesson, Quiz, QuizQuestion } from '../../types/domain'

const emptyForm = {
  id: '',
  question_text: '',
  options: ['', '', '', ''],
  correct_index: 0,
  order_index: 0,
}

export function QuizzesManager() {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [quizTitle, setQuizTitle] = useState('')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function loadData() {
    if (!lessonId) return
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
      setQuizTitle(quizData?.title ?? '')

      if (quizData) {
        const { data: questionData } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', quizData.id)
          .order('order_index')
        setQuestions((questionData as QuizQuestion[]) ?? [])
      }
    } catch {
      setLesson(null)
    }
  }

  useEffect(() => {
    void loadData()
  }, [lessonId])

  async function createQuiz() {
    if (!lessonId || !quizTitle.trim()) return
    await supabase.from('quizzes').insert({ lesson_id: lessonId, title: quizTitle })
    void loadData()
  }

  function editQuestion(q: QuizQuestion) {
    setForm({
      id: q.id,
      question_text: q.question_text,
      options: [...q.options],
      correct_index: q.correct_index,
      order_index: q.order_index,
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!quiz) return
    setSaving(true)

    const payload = {
      question_text: form.question_text,
      options: form.options,
      correct_index: form.correct_index,
      order_index: form.order_index,
    }

    if (form.id) {
      await supabase.from('quiz_questions').update(payload).eq('id', form.id)
    } else {
      await supabase.from('quiz_questions').insert({ ...payload, quiz_id: quiz.id })
    }

    setForm(emptyForm)
    setSaving(false)
    void loadData()
  }

  async function deleteQuestion(id: string) {
    if (!confirm('حذف هذا السؤال؟')) return
    await supabase.from('quiz_questions').delete().eq('id', id)
    void loadData()
  }

  if (!lesson) return <p className="text-sm text-text-muted">جارِ التحميل...</p>

  return (
    <div className="space-y-6">
      <Link to={`/admin/courses/${lesson.course_id}/lessons`} className="text-xs text-primary-600 font-bold">
        &lt; رجوع إلى الدروس
      </Link>

      <h1 className="font-extrabold text-xl text-text-primary">اختبار درس: {lesson.title}</h1>

      {!quiz ? (
        <Card>
          <h2 className="font-extrabold text-text-primary mb-3">إنشاء اختبار لهذا الدرس</h2>
          <div className="flex gap-2">
            <input
              placeholder="عنوان الاختبار"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="flex-1 bg-page rounded-xl px-4 py-2.5 text-sm outline-none"
            />
            <Button onClick={createQuiz}>إنشاء</Button>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <h2 className="font-extrabold text-text-primary mb-3">
              {form.id ? 'تعديل سؤال' : 'سؤال جديد'} — {quiz.title}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                placeholder="نص السؤال"
                value={form.question_text}
                onChange={(e) => setForm((f) => ({ ...f, question_text: e.target.value }))}
                className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none"
              />
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={form.correct_index === i}
                    onChange={() => setForm((f) => ({ ...f, correct_index: i }))}
                  />
                  <input
                    required
                    placeholder={`الخيار ${i + 1}`}
                    value={opt}
                    onChange={(e) =>
                      setForm((f) => {
                        const options = [...f.options]
                        options[i] = e.target.value
                        return { ...f, options }
                      })
                    }
                    className="flex-1 bg-page rounded-xl px-4 py-2 text-sm outline-none"
                  />
                </div>
              ))}
              <label className="flex items-center gap-2 text-sm text-text-muted">
                الترتيب
                <input
                  type="number"
                  value={form.order_index}
                  onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
                  className="w-20 bg-page rounded-lg px-2 py-1 text-sm outline-none"
                />
              </label>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {form.id ? 'حفظ التعديلات' : 'إضافة السؤال'}
                </Button>
                {form.id && (
                  <Button type="button" variant="outline" onClick={() => setForm(emptyForm)}>
                    إلغاء
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <div className="space-y-2">
            {questions.map((q, i) => (
              <Card key={q.id} className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-6">{i + 1}.</span>
                <p className="flex-1 text-sm font-medium text-text-primary">{q.question_text}</p>
                <button onClick={() => editQuestion(q)} className="text-primary-600 p-2">
                  <Pencil size={16} />
                </button>
                <button onClick={() => deleteQuestion(q.id)} className="text-red-500 p-2">
                  <Trash2 size={16} />
                </button>
              </Card>
            ))}
            {questions.length === 0 && (
              <p className="text-sm text-text-muted">لا توجد أسئلة بعد.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
