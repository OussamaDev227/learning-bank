import {
  BookMarked,
  Feather,
  Landmark,
  Mic2,
  PenTool,
  Repeat,
  ScrollText,
  SpellCheck2,
  type LucideIcon,
} from 'lucide-react'

export interface Bank {
  slug: string
  label: string
  sub: string
  icon: LucideIcon
  active: boolean
}

export const banks: Bank[] = [
  { slug: 'nahw', label: 'النحو', sub: 'القواعد وإعراب', icon: Landmark, active: true },
  { slug: 'sarf', label: 'الصرف', sub: 'الأوزان والتصريف', icon: Repeat, active: false },
  { slug: 'balagha', label: 'البلاغة', sub: 'البيان والبديع', icon: Feather, active: false },
  { slug: 'imlaa', label: 'الإملاء', sub: 'قواعد الكتابة', icon: PenTool, active: false },
  { slug: 'aswat', label: 'الأصوات', sub: 'مخارج الحروف والنطق', icon: Mic2, active: false },
  {
    slug: 'mu3jam',
    label: 'المعجم والدلالة',
    sub: 'المفردات والمعاني',
    icon: BookMarked,
    active: false,
  },
  { slug: 'adab', label: 'الأدب', sub: 'النصوص الأدبية والشعر', icon: ScrollText, active: false },
  { slug: 'arud', label: 'العروض', sub: 'البحور والتفعيلات', icon: SpellCheck2, active: false },
]

export const CATEGORY_GENERAL = 'عام'

export function bankBySlug(slug: string | undefined) {
  return banks.find((b) => b.slug === slug)
}
