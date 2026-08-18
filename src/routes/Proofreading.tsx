import { useState, type FormEvent } from 'react'
import { SpellCheck } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabaseClient'

interface ProofreadError {
  original: string
  correction: string
  explanation: string
}

interface ProofreadResult {
  diacritized: string
  errors: ProofreadError[]
}

export function Proofreading() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<ProofreadResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    const { data, error: fnError } = await supabase.functions.invoke('text-tools', {
      body: { tool: 'proofread', text },
    })

    if (fnError || data?.error) {
      setError(data?.error ?? 'تعذّر تدقيق النص، حاول مرة أخرى.')
    } else {
      setResult(data)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
          <SpellCheck size={20} />
        </div>
        <div>
          <h1 className="font-extrabold text-xl text-text-primary">التشكيل والتدقيق</h1>
          <p className="text-xs text-text-muted">أضف التشكيل الكامل وصحّح الأخطاء الإملائية والنحوية</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
        <textarea
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب نصاً عربياً بدون تشكيل هنا..."
          className="w-full bg-surface rounded-2xl px-4 py-3 text-sm shadow-sm outline-none min-h-32"
        />
        <Button type="submit" disabled={loading} className="self-start">
          {loading ? 'جارِ التدقيق...' : 'تشكيل وتدقيق'}
        </Button>
      </form>

      {error && (
        <Card className="mt-5 text-center py-6">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      {result && (
        <div className="mt-5 space-y-3">
          <Card>
            <p className="text-xs font-bold text-text-muted mb-2">النص مشكّلاً</p>
            <p className="text-lg leading-loose text-text-primary">{result.diacritized}</p>
          </Card>

          {result.errors.length === 0 ? (
            <Card className="text-center py-6">
              <p className="text-sm text-primary-600 font-bold">لا توجد أخطاء إملائية أو نحوية</p>
            </Card>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-bold text-text-muted px-1">
                الأخطاء المكتشفة ({result.errors.length})
              </p>
              {result.errors.map((err, i) => (
                <Card key={i}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-red-600 line-through">{err.original}</span>
                    <span className="text-text-muted">&larr;</span>
                    <span className="text-sm font-bold text-primary-600">{err.correction}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">{err.explanation}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
