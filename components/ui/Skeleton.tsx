import { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
  rounded?: boolean
}

function Skeleton({
  width,
  height,
  rounded = false,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={['skeleton', rounded ? 'rounded-full' : 'rounded', className].join(' ')}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  )
}

function SkeletonCard() {
  return (
    <div
      className="rounded-md border border-brand-cream/10 bg-brand-navy-deep p-6"
      aria-hidden="true"
    >
      <Skeleton height="200px" className="mb-4" />
      <Skeleton height="20px" className="mb-2 w-3/4" />
      <Skeleton height="14px" className="mb-4 w-1/2" />
      <div className="flex gap-4">
        <Skeleton height="14px" className="w-16" />
        <Skeleton height="14px" className="w-16" />
        <Skeleton height="14px" className="w-16" />
      </div>
    </div>
  )
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  const widths = ['w-full', 'w-5/6', 'w-4/6', 'w-3/4', 'w-full', 'w-2/3']
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="14px" className={widths[i % widths.length]} />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonText }
export type { SkeletonProps }
