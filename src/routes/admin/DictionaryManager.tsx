import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabaseClient'
import type { DictionaryEntry } from '../../types/domain'

const emptyForm = {
  id: '',
  word: '',
  root: '',
  part_of_speech: '',
  meaning: '',
  examples: '',
  is_published: false,
}

export function DictionaryManager() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function loadEntries() {
    try {
      const { data } = await supabase
        .from('dictionary_entries')
        .select('*')
        .order('word', { ascending: true })
      setEntries((data as DictionaryEntry[]) ?? [])
    } catch {
      setEntries([])
    }
  }

  useEffect(() => {
    void loadEntries()
  }, [])

  function editEntry(e: DictionaryEntry) {
    setForm({
      id: e.id,
      word: e.word,
      root: e.root ?? '',
      part_of_speech: e.part_of_speech ?? '',
      meaning: e.meaning,
      examples: e.examples ?? '',
      is_published: e.is_published,
    })
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    setSaving(true)

    const payload = {
      word: form.word,
      root: form.root || null,
      part_of_speech: form.part_of_speech || null,
      meaning: form.meaning,
      examples: form.examples || null,
      is_published: form.is_published,
    }

    if (form.id) {
      await supabase.from('dictionary_entries').update(payload).eq('id', form.id)
    } else {
      await supabase.from('dictionary_entries').insert(payload)
    }

    setForm(emptyForm)
    setSaving(false)
    void loadEntries()
  }

  async function deleteEntry(id: string) {
    if (!confirm('حذف هذه الكلمة من القاموس؟')) return
    await supabase.from('dictionary_entries').delete().eq('id', id)
    void loadEntries()
  }

  return (
    <div className="space-y-6">
      <h1 className="font-extrabold text-xl text-text-primary">القاموس الذكي</h1>

      <Card>
        <h2 className="font-extrabold text-text-primary mb-3">
          {form.id ? 'تعديل كلمة' : 'كلمة جديدة'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="الكلمة"
              value={form.word}
              onChange={(e) => setForm((f) => ({ ...f, word: e.target.value }))}
              className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none"
            />
            <input
              placeholder="الجذر"
              value={form.root}
              onChange={(e) => setForm((f) => ({ ...f, root: e.target.value }))}
              className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none"
            />
          </div>
          <input
            placeholder="نوع الكلمة (اسم، فعل، حرف...)"
            value={form.part_of_speech}
            onChange={(e) => setForm((f) => ({ ...f, part_of_speech: e.target.value }))}
            className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none"
          />
          <textarea
            required
            placeholder="المعنى"
            value={form.meaning}
            onChange={(e) => setForm((f) => ({ ...f, meaning: e.target.value }))}
            className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none min-h-20"
          />
          <textarea
            placeholder="مثال في جملة (اختياري)"
            value={form.examples}
            onChange={(e) => setForm((f) => ({ ...f, examples: e.target.value }))}
            className="w-full bg-page rounded-xl px-4 py-2.5 text-sm outline-none min-h-16"
          />
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
            />
            منشورة
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {form.id ? 'حفظ التعديلات' : 'إضافة الكلمة'}
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
        {entries.map((e) => (
          <Card key={e.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-text-primary">
                {e.word} {e.root && <span className="text-xs text-text-muted">({e.root})</span>}
              </p>
              <p className="text-xs text-text-muted line-clamp-1">
                {e.is_published ? 'منشورة' : 'مسودة'} · {e.meaning}
              </p>
            </div>
            <button onClick={() => editEntry(e)} className="text-primary-600 p-2">
              <Pencil size={16} />
            </button>
            <button onClick={() => deleteEntry(e.id)} className="text-red-500 p-2">
              <Trash2 size={16} />
            </button>
          </Card>
        ))}
        {entries.length === 0 && <p className="text-sm text-text-muted">لا توجد كلمات بعد.</p>}
      </div>
    </div>
  )
}
