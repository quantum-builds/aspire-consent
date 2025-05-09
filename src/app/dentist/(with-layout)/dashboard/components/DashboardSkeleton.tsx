// components/DashboardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className=" mx-auto mt-15">
      {/* Title and Add Button Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-4 gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-12 w-40" />
      </div>

      {/* Stats Cards */}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="col-span-1 lg:col-span-2 p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <Skeleton className="h-7 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-[300px] w-full" />
        </div>

        {/* Radial Chart */}
        <div className="col-span-1 p-6 bg-white rounded-lg shadow-md">
          <Skeleton className="h-7 w-48 mb-6" />
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <div className="flex flex-col">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-4 w-48 mt-6 mx-auto" />
        </div>
      </div>

      {/* Data Table Section */}
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
    </div>
  );
}
