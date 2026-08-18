import { Bot, Check, Send } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/Button'

const capabilities = [
  'شرح القواعد',
  'تصحيح الأخطاء',
  'توليد تمارين',
  'إعراب الجمل',
  'اقتراح كتب ومراجع',
]

const cannedReplies: Record<string, string> = {
  default:
    'هذا رد تجريبي من المساعد اللغوي الذكي. سيتم ربط المساعد بنموذج ذكاء اصطناعي حقيقي في نسخة لاحقة.',
}

interface Message {
  from: 'user' | 'bot'
  text: string
}

export function AIAssistantPanel() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'مرحباً! أنا مساعدك اللغوي الذكي. اسألني عن قاعدة نحوية أو إملائية.' },
  ])

  function send() {
    if (!input.trim()) return
    const userMsg: Message = { from: 'user', text: input.trim() }
    const botMsg: Message = { from: 'bot', text: cannedReplies.default }
    setMessages((m) => [...m, userMsg, botMsg])
    setInput('')
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center">
          <Bot size={18} />
        </div>
        <p className="font-extrabold text-sm text-text-primary">المساعد اللغوي الذكي</p>
      </div>

      {!open ? (
        <>
          <ul className="space-y-1.5 mb-4">
            {capabilities.map((c) => (
              <li key={c} className="flex items-center gap-2 text-xs text-text-muted">
                <Check size={13} className="text-primary-600 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
          <Button className="w-full" onClick={() => setOpen(true)}>
            اسأل الآن
          </Button>
        </>
      ) : (
        <div>
          <div className="max-h-56 overflow-y-auto space-y-2 mb-3 pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-xs rounded-xl px-3 py-2 max-w-[85%] ${
                  m.from === 'bot'
                    ? 'bg-white text-text-primary'
                    : 'bg-primary-600 text-white mr-auto'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 bg-white rounded-full px-3 py-2 text-xs outline-none border border-primary-100"
            />
            <button
              onClick={send}
              className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0"
              aria-label="إرسال"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
