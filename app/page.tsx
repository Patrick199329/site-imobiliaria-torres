import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { FeaturedProperties } from '@/components/home/FeaturedProperties'
import { Pillars } from '@/components/home/Pillars'
import { Team } from '@/components/home/Team'
import { BlogPreview } from '@/components/home/BlogPreview'
import { SellCTA } from '@/components/home/SellCTA'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProperties />
        <Pillars />
        <Team />
        <BlogPreview />
        <SellCTA />
      </main>
      <Footer />
    </>
  )
}
