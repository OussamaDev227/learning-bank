import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { supabase } from '../../lib/supabaseClient'
import { bankBySlug } from '../../lib/banks'
import type { Course } from '../../types/domain'

export function BankCourses() {
  const { slug } = useParams()
  const bank = bankBySlug(slug)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bank) return

    async function load() {
      try {
        const { data } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .eq('category', bank!.label)
          .order('order_index', { ascending: true })
        setCourses((data as Course[]) ?? [])
      } catch {
        setCourses([])
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [bank])

  if (!bank) {
    return <p className="text-sm text-text-muted">هذا البنك غير متاح حالياً.</p>
  }

  const Icon = bank.icon

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
          <Icon size={20} />
        </div>
        <div>
          <h1 className="font-extrabold text-xl text-text-primary">{bank.label}</h1>
          <p className="text-xs text-text-muted">{bank.sub}</p>
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <p className="text-sm text-text-muted">جارِ التحميل...</p>
        ) : courses.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-sm text-text-muted">لا توجد دورات منشورة في هذا البنك بعد.</p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <Link key={c.id} to={`/learn/${c.id}`}>
                <Card className="h-full flex flex-col gap-2">
                  <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                    <BookOpen size={20} />
                  </div>
                  <p className="font-bold text-text-primary">{c.title}</p>
                  {c.description && (
                    <p className="text-xs text-text-muted line-clamp-2">{c.description}</p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
