import { useState, type FormEvent } from 'react'
import { ScanText } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { supabase } from '../lib/supabaseClient'

interface AnalysisResult {
  summary: string
  themes: string[]
  style: string
  tone: string
}

export function TextAnalysis() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    const { data, error: fnError } = await supabase.functions.invoke('text-tools', {
      body: { tool: 'analyze', text },
    })

    if (fnError || data?.error) {
      setError(data?.error ?? 'تعذّر تحليل النص، حاول مرة أخرى.')
    } else {
      setResult(data)
    }

    setLoading(false)
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
          <ScanText size={20} />
        </div>
        <div>
          <h1 className="font-extrabold text-xl text-text-primary">تحليل النصوص</h1>
          <p className="text-xs text-text-muted">افهم الفكرة الرئيسية والأسلوب والنبرة في أي نص</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
        <textarea
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ألصق أو اكتب نصاً عربياً هنا للتحليل..."
          className="w-full bg-surface rounded-2xl px-4 py-3 text-sm shadow-sm outline-none min-h-40"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">{wordCount} كلمة</span>
          <Button type="submit" disabled={loading}>
            {loading ? 'جارِ التحليل...' : 'تحليل النص'}
          </Button>
        </div>
      </form>

      {error && (
        <Card className="mt-5 text-center py-6">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      {result && (
        <div className="mt-5 space-y-3">
          <Card>
            <p className="text-xs font-bold text-text-muted mb-1">الفكرة الرئيسية</p>
            <p className="text-sm text-text-primary">{result.summary}</p>
          </Card>
          <Card>
            <p className="text-xs font-bold text-text-muted mb-2">أهم المواضيع</p>
            <div className="flex flex-wrap gap-2">
              {result.themes.map((t, i) => (
                <Badge key={i}>{t}</Badge>
              ))}
            </div>
          </Card>
          <div className="grid sm:grid-cols-2 gap-3">
            <Card>
              <p className="text-xs font-bold text-text-muted mb-1">الأسلوب</p>
              <p className="text-sm text-text-primary">{result.style}</p>
            </Card>
            <Card>
              <p className="text-xs font-bold text-text-muted mb-1">النبرة</p>
              <p className="text-sm text-text-primary">{result.tone}</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
