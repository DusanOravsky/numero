interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] rounded ${className}`}
      style={{ animation: 'skeleton-shimmer 1.5s ease-in-out infinite' }}
    />
  );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="glass rounded-2xl p-6 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="glass rounded-2xl p-6">
      <Skeleton className="h-5 w-1/3 mb-4" />
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonChakraList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-4 flex items-start gap-4">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonClientDashboard() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/2" />
      <SkeletonCard lines={5} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SkeletonGrid />
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
      </div>
      <SkeletonCard lines={6} />
    </div>
  );
}
