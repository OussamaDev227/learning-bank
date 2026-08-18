import { GraduationCap, Library, Pause, Play, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import { ComingSoonBadge } from '../ui/Badge'

const steps = ['مبتدئ', 'متمكن', 'متوسط']

function RadioWidget() {
  const [playing, setPlaying] = useState(false)
  return (
    <Card>
      <p className="font-extrabold text-sm mb-1">إذاعة بنك علوم اللغة العربية</p>
      <p className="text-[11px] text-text-muted mb-3">دروس صوتية، حوارات تعليمية، قصص ونصوص، نصائح لغوية</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0"
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <div className="flex-1 h-1.5 rounded-full bg-page overflow-hidden">
          <div className="h-full bg-primary-600 w-1/3" />
        </div>
        <span className="text-[10px] text-text-muted shrink-0">02:45 / 08:30</span>
      </div>
    </Card>
  )
}

function LearningPathWidget() {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp size={16} className="text-primary-600" />
        <p className="font-extrabold text-sm">مسار تعلم العربية</p>
      </div>
      <div className="flex items-center justify-between my-3 px-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-primary-600' : 'bg-primary-100'}`}
            />
            <span className="text-[10px] text-text-muted">{s}</span>
          </div>
        ))}
      </div>
      <Link
        to="/learn"
        className="mt-auto text-center rounded-full bg-primary-600 text-white text-xs font-bold py-2 hover:bg-primary-700"
      >
        ابدأ رحلتك الآن
      </Link>
    </Card>
  )
}

function DigitalLibraryWidget() {
  return (
    <Link to="/library">
      <Card className="h-full hover:border-primary-200 border border-transparent">
        <div className="flex items-center gap-2 mb-1">
          <Library size={16} className="text-primary-600" />
          <p className="font-extrabold text-sm">المكتبة الرقمية</p>
        </div>
        <ul className="text-[11px] text-text-muted space-y-1 mt-2">
          <li>كتب</li>
          <li>مقالات</li>
          <li>رسائل جامعية</li>
          <li>معاجم رقمية</li>
        </ul>
      </Card>
    </Link>
  )
}

function TeacherAcademyWidget() {
  return (
    <Card className="relative">
      <ComingSoonBadge />
      <div className="flex items-center gap-2 mb-1">
        <GraduationCap size={16} className="text-primary-600" />
        <p className="font-extrabold text-sm">أكاديمية المعلم</p>
      </div>
      <p className="text-[11px] text-text-muted mt-2">تكوين، موارد تعليمية، استراتيجيات تدريس</p>
    </Card>
  )
}

export function BottomWidgets() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <RadioWidget />
      <LearningPathWidget />
      <DigitalLibraryWidget />
      <TeacherAcademyWidget />
    </div>
  )
}
