import {
  BookMarked,
  Feather,
  Landmark,
  Mic2,
  PenTool,
  Repeat,
  ScrollText,
  SpellCheck2,
} from 'lucide-react'
import { Card } from '../ui/Card'
import { ComingSoonBadge } from '../ui/Badge'

const banks = [
  { label: 'النحو', sub: 'القواعد وإعراب', icon: Landmark },
  { label: 'الصرف', sub: 'الأوزان والتصريف', icon: Repeat },
  { label: 'البلاغة', sub: 'البيان والبديع', icon: Feather },
  { label: 'الإملاء', sub: 'قواعد الكتابة', icon: PenTool },
  { label: 'الأصوات', sub: 'مخارج الحروف والنطق', icon: Mic2 },
  { label: 'المعجم والدلالة', sub: 'المفردات والمعاني', icon: BookMarked },
  { label: 'الأدب', sub: 'النصوص الأدبية والشعر', icon: ScrollText },
  { label: 'العروض', sub: 'البحور والتفعيلات', icon: SpellCheck2 },
]

export function BanksGrid() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-extrabold text-lg text-text-primary">بنوك علوم اللغة العربية</h2>
        <button className="text-primary-600 text-sm font-bold">عرض الكل &lt;</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {banks.map(({ label, sub, icon: Icon }) => (
          <Card key={label} className="relative flex flex-col items-center text-center gap-2 opacity-90">
            <ComingSoonBadge />
            <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
              <Icon size={20} />
            </div>
            <p className="font-bold text-sm text-text-primary">{label}</p>
            <p className="text-[11px] text-text-muted">{sub}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
