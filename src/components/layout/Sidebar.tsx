import {
  BookOpenCheck,
  FileSearch,
  Languages,
  ListChecks,
  Mic,
  NotebookText,
  ScanText,
  SpellCheck,
  Volume2,
  FolderCog,
  LayoutGrid,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const tools = [
  { label: 'تحليل النصوص', icon: ScanText, active: false },
  { label: 'استخراج الكلمات', icon: FileSearch, active: false },
  { label: 'التشكيل والتدقيق', icon: SpellCheck, active: false },
  { label: 'القاموس الذكي', icon: BookOpenCheck, active: false },
  { label: 'إعراب الجمل', icon: NotebookText, active: false },
  { label: 'ترجمة النصوص', icon: Languages, active: false },
  { label: 'تحويل النص إلى صوت', icon: Volume2, active: false },
  { label: 'إنشاء اختبارات', icon: ListChecks, active: false },
  { label: 'إدارة المراجع', icon: FolderCog, active: false },
  { label: 'حفظ الملاحظات', icon: Mic, active: false },
]

export function Sidebar() {
  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="rounded-2xl bg-surface shadow-sm p-4 sticky top-20">
        <div className="flex items-center gap-2 mb-3 px-1">
          <LayoutGrid size={16} className="text-primary-600" />
          <h3 className="text-sm font-extrabold text-text-primary">أدوات المنصة</h3>
        </div>

        <ul className="space-y-1">
          {tools.map(({ label, icon: Icon }) => (
            <li key={label}>
              <button
                disabled
                title="قريباً"
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-muted cursor-not-allowed hover:bg-page"
              >
                <Icon size={17} />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>

        <Link
          to="/learn"
          className="mt-3 block w-full rounded-full bg-primary-600 text-white text-center text-sm font-bold py-2.5 hover:bg-primary-700"
        >
          عرض جميع الأدوات
        </Link>
      </div>
    </aside>
  )
}
