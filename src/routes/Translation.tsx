import { useState, type FormEvent } from 'react'
import { Languages } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabaseClient'

const languages = ['الإنجليزية', 'الفرنسية', 'الإسبانية', 'التركية', 'الألمانية']

export function Translation() {
  const [text, setText] = useState('')
  const [targetLanguage, setTargetLanguage] = useState(languages[0])
  const [translation, setTranslation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setTranslation(null)

    const { data, error: fnError } = await supabase.functions.invoke('text-tools', {
      body: { tool: 'translate', text, targetLanguage },
    })

    if (fnError || data?.error) {
      setError(data?.error ?? 'تعذّرت الترجمة، حاول مرة أخرى.')
    } else {
      setTranslation(data.translation)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
          <Languages size={20} />
        </div>
        <div>
          <h1 className="font-extrabold text-xl text-text-primary">ترجمة النصوص</h1>
          <p className="text-xs text-text-muted">ترجم نصوصاً عربية إلى لغات أخرى بدقة</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
        <textarea
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب النص العربي المراد ترجمته..."
          className="w-full bg-surface rounded-2xl px-4 py-3 text-sm shadow-sm outline-none min-h-32"
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="bg-surface rounded-full px-4 py-2 text-sm shadow-sm outline-none"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                إلى {l}
              </option>
            ))}
          </select>
          <Button type="submit" disabled={loading}>
            {loading ? 'جارِ الترجمة...' : 'ترجمة'}
          </Button>
        </div>
      </form>

      {error && (
        <Card className="mt-5 text-center py-6">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      {translation && (
        <Card className="mt-5">
          <p className="text-xs font-bold text-text-muted mb-2">الترجمة إلى {targetLanguage}</p>
          <p className="text-sm text-text-primary" dir="auto">
            {translation}
          </p>
        </Card>
      )}
    </div>
  )
}
