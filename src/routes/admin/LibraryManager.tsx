import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { supabase } from '../../lib/supabaseClient'
import type { LibraryResource, LibraryResourceType } from '../../types/domain'

const types: LibraryResourceType[] = ['كتاب', 'مقال', 'رسالة جامعية', 'معجم رقمي']

const emptyForm = {
  id: '',
  title: '',
  description: '',
  author: '',
  resource_type: types[0],
  file_url: '',
  is_published: false,
}

export function LibraryManager() {
  const [resources, setResources] = useState<LibraryResource[]>([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function loadResources() {
    try {
      const { data } = await supabase
        .from('library_resources')
        .select('*')
        .order('created_at', { ascending: false })
      setResources((data as LibraryResource[]) ?? [])
    } catch {
      setResources([])
    }
  }

  useEffect(() => {
    void loadResources()
  }, [])

  function editResource(r: LibraryResource) {
    setForm({
      id: r.id,
      title: r.title,
      description: r.description ?? '',
      author: r.author ?? '',
      resource_type: r.resource_type,
      file_url: r.file_url,
      is_published: r.is_published,
    })
    setError(null)
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    setSaving(true)
    setError(null)

    let fileUrl = form.file_url
    const file = fileInputRef.current?.files?.[0]

    if (file) {
      const path = `${crypto.randomUUID()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from('library').upload(path, file)
      if (uploadError) {
        setError('فشل رفع الملف: ' + uploadError.message)
        setSaving(false)
        return
      }
      fileUrl = supabase.storage.from('library').getPublicUrl(path).data.publicUrl
    }

    if (!fileUrl) {
      setError('يرجى اختيار ملف لرفعه')
      setSaving(false)
      return
    }

    const payload = {
      title: form.title,
      description: form.description || null,
      author: form.author || null,
      resource_type: form.resource_type,
      file_url: fileUrl,
      is_published: form.is_published,
    }

    if (form.id) {
      await supabase.from('library_resources').update(payload).eq('id', form.id)
    } else {
      await supabase.from('library_resources').insert(payload)
    }

    setForm(emptyForm)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setSaving(false)
    void loadResources()
  }

  async function deleteResource(id: string) {
    if (!confirm('حذف هذا المصدر؟')) return
    await supabase.from('library_resources').delete().eq('id', id)
    void loadResources()
  }

  return (
    <div className="space-y-6">
      <h1 className="font-extrabold text-xl text-text-primary">المكتبة الرقمية</h1>

      <Card>
        <h2 className="font-extrabold text-text-primary mb-3">
          {form.id ? 'تعديل مصدر' : 'مصدر جديد'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="العنوان"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              placeholder="المؤلف (اختياري)"
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none"
            />
            <select
              value={form.resource_type}
              onChange={(e) =>
                setForm((f) => ({ ...f, resource_type: e.target.value as LibraryResourceType }))
              }
              className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="وصف مختصر"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none min-h-20"
          />
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.epub"
              className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none file:ml-3 file:rounded-full file:border-0 file:bg-primary-100 file:text-primary-700 file:px-3 file:py-1.5 file:text-xs file:font-bold"
            />
            {form.id && form.file_url && (
              <p className="text-xs text-text-muted mt-1">
                يوجد ملف مرفوع بالفعل — اختر ملفاً جديداً فقط لاستبداله.
              </p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
            />
            منشور
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'جارِ الحفظ...' : form.id ? 'حفظ التعديلات' : 'إضافة المصدر'}
            </Button>
            {form.id && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(emptyForm)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              >
                إلغاء
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="space-y-2">
        {resources.map((r) => (
          <Card key={r.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-text-primary">{r.title}</p>
                <Badge>{r.resource_type}</Badge>
              </div>
              <p className="text-xs text-text-muted">{r.is_published ? 'منشور' : 'مسودة'}</p>
            </div>
            <button onClick={() => editResource(r)} className="text-primary-600 p-2">
              <Pencil size={16} />
            </button>
            <button onClick={() => deleteResource(r.id)} className="text-red-500 p-2">
              <Trash2 size={16} />
            </button>
          </Card>
        ))}
        {resources.length === 0 && <p className="text-sm text-text-muted">لا توجد مصادر بعد.</p>}
      </div>
    </div>
  )
}
