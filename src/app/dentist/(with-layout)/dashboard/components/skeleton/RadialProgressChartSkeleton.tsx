import { Skeleton } from "@/components/ui/skeleton";

export default function RadialProgessChartSkeleton() {
  return (
    <div className="col-span-1 h-[450px] p-6 bg-white rounded-lg shadow-md">
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
  );
}
