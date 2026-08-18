import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabaseClient'
import type { Course, Lesson } from '../../types/domain'

const emptyForm = { id: '', title: '', content: '', order_index: 0, is_published: false }

export function LessonsManager() {
  const { courseId } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function loadData() {
    if (!courseId) return
    try {
      const [{ data: courseData }, { data: lessonData }] = await Promise.all([
        supabase.from('courses').select('*').eq('id', courseId).single(),
        supabase.from('lessons').select('*').eq('course_id', courseId).order('order_index'),
      ])
      setCourse(courseData as Course)
      setLessons((lessonData as Lesson[]) ?? [])
    } catch {
      setCourse(null)
      setLessons([])
    }
  }

  useEffect(() => {
    void loadData()
  }, [courseId])

  function editLesson(l: Lesson) {
    setForm({
      id: l.id,
      title: l.title,
      content: l.content,
      order_index: l.order_index,
      is_published: l.is_published,
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!courseId) return
    setSaving(true)

    if (form.id) {
      await supabase
        .from('lessons')
        .update({
          title: form.title,
          content: form.content,
          order_index: form.order_index,
          is_published: form.is_published,
        })
        .eq('id', form.id)
    } else {
      await supabase.from('lessons').insert({
        course_id: courseId,
        title: form.title,
        content: form.content,
        order_index: form.order_index,
        is_published: form.is_published,
      })
    }

    setForm(emptyForm)
    setSaving(false)
    void loadData()
  }

  async function deleteLesson(id: string) {
    if (!confirm('حذف هذا الدرس؟')) return
    await supabase.from('lessons').delete().eq('id', id)
    void loadData()
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/courses" className="text-xs text-primary-600 font-bold">
        &lt; رجوع إلى الدورات
      </Link>

      <h1 className="font-extrabold text-xl text-text-primary">
        دروس دورة: {course?.title ?? '...'}
      </h1>

      <Card>
        <h2 className="font-extrabold text-text-primary mb-3">
          {form.id ? 'تعديل درس' : 'درس جديد'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="عنوان الدرس"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none"
          />
          <textarea
            required
            placeholder="محتوى الدرس (يدعم Markdown)"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none min-h-40 font-mono"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-text-muted">
              الترتيب
              <input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
                className="w-20 bg-page rounded-lg px-2 py-1 text-sm outline-none"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
              />
              منشور
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {form.id ? 'حفظ التعديلات' : 'إضافة الدرس'}
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
        {lessons.map((l) => (
          <Card key={l.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-text-primary">{l.title}</p>
              <p className="text-xs text-text-muted">
                {l.is_published ? 'منشور' : 'مسودة'} · ترتيب {l.order_index}
              </p>
            </div>
            <Link to={`/admin/lessons/${l.id}/quiz`}>
              <Button variant="ghost">إدارة الاختبار</Button>
            </Link>
            <button onClick={() => editLesson(l)} className="text-primary-600 p-2">
              <Pencil size={16} />
            </button>
            <button onClick={() => deleteLesson(l.id)} className="text-red-500 p-2">
              <Trash2 size={16} />
            </button>
          </Card>
        ))}
        {lessons.length === 0 && <p className="text-sm text-text-muted">لا توجد دروس بعد.</p>}
      </div>
    </div>
  )
}
