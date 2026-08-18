import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import { banks } from '../../lib/banks'

export function BanksGrid() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-extrabold text-lg text-text-primary">بنوك علوم اللغة العربية</h2>
        <button className="text-primary-600 text-sm font-bold">عرض الكل &lt;</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {banks.map(({ slug, label, sub, icon: Icon }) => (
          <Link key={slug} to={`/banks/${slug}`}>
            <Card className="flex flex-col items-center text-center gap-2 hover:border-primary-200 border border-transparent">
              <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                <Icon size={20} />
              </div>
              <p className="font-bold text-sm text-text-primary">{label}</p>
              <p className="text-[11px] text-text-muted">{sub}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
