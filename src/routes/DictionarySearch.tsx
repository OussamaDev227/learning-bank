import { useEffect, useState } from 'react'
import { BookOpenCheck, Search } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { supabase } from '../lib/supabaseClient'
import type { DictionaryEntry } from '../types/domain'

export function DictionarySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<DictionaryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const term = query.trim()
    if (!term) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    const timeout = setTimeout(async () => {
      try {
        const { data } = await supabase
          .from('dictionary_entries')
          .select('*')
          .eq('is_published', true)
          .or(`word.ilike.%${term}%,root.ilike.%${term}%`)
          .order('word', { ascending: true })
          .limit(30)
        setResults((data as DictionaryEntry[]) ?? [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
        setSearched(true)
      }
    }, 350)

    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
          <BookOpenCheck size={20} />
        </div>
        <div>
          <h1 className="font-extrabold text-xl text-text-primary">القاموس الذكي</h1>
          <p className="text-xs text-text-muted">ابحث عن معنى كلمة أو جذرها</p>
        </div>
      </div>

      <div className="mt-5 flex items-center bg-surface rounded-full px-4 py-3 shadow-sm">
        <Search size={18} className="text-text-muted shrink-0" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="اكتب كلمة عربية..."
          className="bg-transparent outline-none px-3 text-sm w-full placeholder:text-text-muted"
        />
      </div>

      <div className="mt-5 space-y-3">
        {loading && <p className="text-sm text-text-muted">جارِ البحث...</p>}

        {!loading && searched && results.length === 0 && (
          <Card className="text-center py-8">
            <p className="text-sm text-text-muted">لم يتم العثور على نتائج لـ "{query}"</p>
          </Card>
        )}

        {!loading &&
          results.map((entry) => (
            <Card key={entry.id}>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-extrabold text-lg text-text-primary">{entry.word}</p>
                {entry.part_of_speech && <Badge>{entry.part_of_speech}</Badge>}
                {entry.root && (
                  <span className="text-xs text-text-muted">الجذر: {entry.root}</span>
                )}
              </div>
              <p className="text-sm text-text-primary">{entry.meaning}</p>
              {entry.examples && (
                <p className="text-xs text-text-muted mt-2 italic">{entry.examples}</p>
              )}
            </Card>
          ))}
      </div>
    </div>
  )
}
