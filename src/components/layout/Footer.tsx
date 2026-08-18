import { Award, ClipboardCheck, Headphones, Trophy, Users } from 'lucide-react'
import { Logo } from '../Logo'

const quickLinks = [
  { label: 'شهادات رقمية', icon: Award },
  { label: 'اختبارات وتقييم', icon: ClipboardCheck },
  { label: 'مسابقات وتحديات', icon: Trophy },
  { label: 'منتدى المتعلمين', icon: Users },
  { label: 'دعم فني', icon: Headphones },
]

const socials = ['Telegram', 'YouTube', 'Facebook', 'X', 'Instagram']

export function Footer() {
  return (
    <footer className="bg-footer-navy text-white mt-12">
      <div className="mx-auto max-w-[1400px] px-4 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
        {quickLinks.map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-white/80">
            <Icon size={16} className="text-accent-gold" />
            {label}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-6 text-center">
        <p className="text-sm text-white/70 max-w-2xl mx-auto">
          "اللغة العربية مفتاح الفكر، وجسر الحضارة، وبنك علومها طريقها إلى الإبداع والتعلم"
        </p>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-bold text-sm">بنك علوم اللغة العربية التعليمي</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60 ml-2">تابعنا على</span>
          {socials.map((s) => (
            <span
              key={s}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px]"
              title={s}
            >
              {s[0]}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
