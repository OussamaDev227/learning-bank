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
}

export const banks: Bank[] = [
  { slug: 'nahw', label: 'النحو', sub: 'القواعد وإعراب', icon: Landmark },
  { slug: 'sarf', label: 'الصرف', sub: 'الأوزان والتصريف', icon: Repeat },
  { slug: 'balagha', label: 'البلاغة', sub: 'البيان والبديع', icon: Feather },
  { slug: 'imlaa', label: 'الإملاء', sub: 'قواعد الكتابة', icon: PenTool },
  { slug: 'aswat', label: 'الأصوات', sub: 'مخارج الحروف والنطق', icon: Mic2 },
  { slug: 'mu3jam', label: 'المعجم والدلالة', sub: 'المفردات والمعاني', icon: BookMarked },
  { slug: 'adab', label: 'الأدب', sub: 'النصوص الأدبية والشعر', icon: ScrollText },
  { slug: 'arud', label: 'العروض', sub: 'البحور والتفعيلات', icon: SpellCheck2 },
]

export const CATEGORY_GENERAL = 'عام'

export function bankBySlug(slug: string | undefined) {
  return banks.find((b) => b.slug === slug)
}
