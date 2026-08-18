import { Sidebar } from '../components/layout/Sidebar'
import { HeroCarousel } from '../components/home/HeroCarousel'
import { BanksGrid } from '../components/home/BanksGrid'
import { BottomWidgets } from '../components/home/BottomWidgets'
import { ProfileStatsCard } from '../components/home/ProfileStatsCard'
import { AIAssistantPanel } from '../components/home/AIAssistantPanel'
import { LatestLessonsList } from '../components/home/LatestLessonsList'

export function Home() {
  return (
    <div className="flex flex-col lg:flex-row items-start gap-6">
      <div className="order-1 lg:order-2 w-full lg:flex-1 lg:min-w-0 flex flex-col gap-6">
        <HeroCarousel />
        <BanksGrid />
        <BottomWidgets />
      </div>

      <div className="order-2 lg:order-1 w-full lg:w-80 lg:shrink-0 flex flex-col gap-4">
        <ProfileStatsCard />
        <AIAssistantPanel />
        <LatestLessonsList />
      </div>

      <div className="order-3 w-full lg:w-auto">
        <Sidebar />
      </div>
    </div>
  )
}
