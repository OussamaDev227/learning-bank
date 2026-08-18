import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

const letters = ['ض', 'ق', 'ن', 'ك', 'م', 'ص', 'ذ']
const features = ['تعلم', 'بحث', 'تدريب', 'تقويم', 'تفاعل']

export function HeroCarousel() {
  const [slide, setSlide] = useState(0)
  const slides = 5

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600 text-white p-8 min-h-[320px] flex flex-col justify-between">
      <div className="absolute inset-0 pointer-events-none opacity-20 select-none">
        {letters.map((l, i) => (
          <span
            key={i}
            className="absolute text-4xl font-black text-accent-gold"
            style={{
              top: `${(i * 37) % 90}%`,
              left: `${(i * 53) % 90}%`,
            }}
          >
            {l}
          </span>
        ))}
      </div>

      <div className="relative z-10 max-w-lg">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          بنك علوم اللغة العربية التعليمي
        </h1>
        <p className="text-white/80 mb-4 text-sm md:text-base">
          منصة رقمية متكاملة لتعليم علوم اللغة العربية للناطقين بها وبغيرها
        </p>
        <div className="flex flex-wrap gap-3 mb-6 text-xs md:text-sm">
          {features.map((f) => (
            <span key={f} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
              <span className="w-4 h-4 rounded-full bg-accent-gold text-primary-900 flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
              {f}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="!border-white !text-white hover:!bg-white/10">
            شاهد فيديو تعريفي
          </Button>
          <Link to="/learn">
            <Button className="!bg-white !text-primary-700 hover:!bg-white/90">
              استكشف المحتوى
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-6">
        <button
          onClick={() => setSlide((s) => (s - 1 + slides) % slides)}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
          aria-label="السابق"
        >
          <ChevronRight size={16} />
        </button>
        <div className="flex gap-1.5">
          {Array.from({ length: slides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? 'w-6 bg-accent-gold' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`الشريحة ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setSlide((s) => (s + 1) % slides)}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
          aria-label="التالي"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
    </div>
  )
}
