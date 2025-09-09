import { Skeleton } from "@/components/ui/skeleton";

export default function ConsentDataTableSkeleton() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Skeleton className="h-7 w-48" />
        <div className="relative w-full md:w-1/2">
          <Skeleton className="h-12 w-full" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["Completed", "Pending", "In Progress"].map((tab) => (
          <Skeleton key={tab} className="h-12 w-32 rounded-full" />
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-5 gap-4 mb-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-6 w-full" />
              ))}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
}
