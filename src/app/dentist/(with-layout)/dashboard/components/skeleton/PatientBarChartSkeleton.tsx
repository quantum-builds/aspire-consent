import { Skeleton } from "@/components/ui/skeleton";

export default function PatientBarChartSkeleton() {
  return (
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
  );
}
