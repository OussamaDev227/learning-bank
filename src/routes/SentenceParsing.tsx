import { useState, type FormEvent } from 'react'
import { NotebookText } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabaseClient'

interface WordAnalysis {
  word: string
  role: string
  explanation: string
}

export function SentenceParsing() {
  const [sentence, setSentence] = useState('')
  const [words, setWords] = useState<WordAnalysis[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!sentence.trim()) return

    setLoading(true)
    setError(null)
    setWords(null)

    const { data, error: fnError } = await supabase.functions.invoke('analyze-sentence', {
      body: { sentence },
    })

    if (fnError || data?.error) {
      setError(data?.error ?? 'تعذّر تحليل الجملة، حاول مرة أخرى.')
    } else {
      setWords(data.words)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
          <NotebookText size={20} />
        </div>
        <div>
          <h1 className="font-extrabold text-xl text-text-primary">إعراب الجمل</h1>
          <p className="text-xs text-text-muted">اكتب جملة عربية واحصل على إعرابها كاملاً</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
        <textarea
          required
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          placeholder="مثال: ذهب الطالبُ إلى المدرسةِ"
          className="w-full bg-surface rounded-2xl px-4 py-3 text-sm shadow-sm outline-none min-h-24"
        />
        <Button type="submit" disabled={loading} className="self-start">
          {loading ? 'جارِ التحليل...' : 'إعراب الجملة'}
        </Button>
      </form>

      {error && (
        <Card className="mt-5 text-center py-6">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      {words && (
        <div className="mt-5 space-y-2">
          {words.map((w, i) => (
            <Card key={i} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-extrabold text-text-primary">{w.word}</p>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 rounded-full px-2.5 py-0.5">
                  {w.role}
                </span>
              </div>
              <p className="text-sm text-text-muted">{w.explanation}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
