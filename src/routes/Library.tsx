import { useEffect, useState } from 'react'
import { Download, Library as LibraryIcon } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { supabase } from '../lib/supabaseClient'
import type { LibraryResource, LibraryResourceType } from '../types/domain'

const types: LibraryResourceType[] = ['كتاب', 'مقال', 'رسالة جامعية', 'معجم رقمي']

export function Library() {
  const [resources, setResources] = useState<LibraryResource[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<LibraryResourceType | 'الكل'>('الكل')

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('library_resources')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
        setResources((data as LibraryResource[]) ?? [])
      } catch {
        setResources([])
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const filtered = filter === 'الكل' ? resources : resources.filter((r) => r.resource_type === filter)

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
          <LibraryIcon size={20} />
        </div>
        <div>
          <h1 className="font-extrabold text-xl text-text-primary">المكتبة الرقمية</h1>
          <p className="text-xs text-text-muted">كتب، مقالات، رسائل جامعية، ومعاجم رقمية</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-5 mb-5">
        {(['الكل', ...types] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              filter === t
                ? 'bg-primary-600 text-white'
                : 'bg-surface text-text-muted hover:bg-primary-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-text-muted">جارِ التحميل...</p>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-sm text-text-muted">لا توجد مصادر منشورة في هذا التصنيف بعد.</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <Card key={r.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Badge>{r.resource_type}</Badge>
              </div>
              <p className="font-bold text-text-primary">{r.title}</p>
              {r.author && <p className="text-xs text-text-muted">{r.author}</p>}
              {r.description && (
                <p className="text-xs text-text-muted line-clamp-2">{r.description}</p>
              )}
              <a
                href={r.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2 rounded-full bg-primary-600 text-white text-xs font-bold py-2 hover:bg-primary-700"
              >
                <Download size={14} />
                تحميل / فتح
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
