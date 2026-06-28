'use client'

import dynamic from 'next/dynamic'
import { SkeletonCard } from '@/components/ui'

const MapView = dynamic(() => import('./MapView').then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] w-full">
      <SkeletonCard />
    </div>
  ),
})

export { MapView }
