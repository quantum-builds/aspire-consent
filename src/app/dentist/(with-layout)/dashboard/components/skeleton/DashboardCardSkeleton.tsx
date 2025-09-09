import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-8 w-1/2 mb-2" />
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-[40px] w-full" />
        </div>
      ))}
    </div>
  );
}
