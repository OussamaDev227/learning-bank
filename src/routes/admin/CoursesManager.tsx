import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabaseClient'
import type { Course } from '../../types/domain'

const emptyForm = { id: '', title: '', description: '', order_index: 0, is_published: false }

export function CoursesManager() {
  const [courses, setCourses] = useState<Course[]>([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function loadCourses() {
    try {
      const { data } = await supabase.from('courses').select('*').order('order_index')
      setCourses((data as Course[]) ?? [])
    } catch {
      setCourses([])
    }
  }

  useEffect(() => {
    void loadCourses()
  }, [])

  function editCourse(c: Course) {
    setForm({
      id: c.id,
      title: c.title,
      description: c.description ?? '',
      order_index: c.order_index,
      is_published: c.is_published,
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)

    if (form.id) {
      await supabase
        .from('courses')
        .update({
          title: form.title,
          description: form.description || null,
          order_index: form.order_index,
          is_published: form.is_published,
        })
        .eq('id', form.id)
    } else {
      await supabase.from('courses').insert({
        title: form.title,
        description: form.description || null,
        order_index: form.order_index,
        is_published: form.is_published,
      })
    }

    setForm(emptyForm)
    setSaving(false)
    void loadCourses()
  }

  async function deleteCourse(id: string) {
    if (!confirm('حذف هذه الدورة وكل دروسها؟')) return
    await supabase.from('courses').delete().eq('id', id)
    void loadCourses()
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-extrabold text-text-primary mb-3">
          {form.id ? 'تعديل دورة' : 'دورة جديدة'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="عنوان الدورة"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none"
          />
          <textarea
            placeholder="وصف مختصر"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none min-h-20"
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
              منشورة
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {form.id ? 'حفظ التعديلات' : 'إضافة الدورة'}
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
        {courses.map((c) => (
          <Card key={c.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-text-primary">{c.title}</p>
              <p className="text-xs text-text-muted">
                {c.is_published ? 'منشورة' : 'مسودة'} · ترتيب {c.order_index}
              </p>
            </div>
            <Link to={`/admin/courses/${c.id}/lessons`}>
              <Button variant="ghost">إدارة الدروس</Button>
            </Link>
            <button onClick={() => editCourse(c)} className="text-primary-600 p-2">
              <Pencil size={16} />
            </button>
            <button onClick={() => deleteCourse(c.id)} className="text-red-500 p-2">
              <Trash2 size={16} />
            </button>
          </Card>
        ))}
        {courses.length === 0 && <p className="text-sm text-text-muted">لا توجد دورات بعد.</p>}
      </div>
    </div>
  )
}
