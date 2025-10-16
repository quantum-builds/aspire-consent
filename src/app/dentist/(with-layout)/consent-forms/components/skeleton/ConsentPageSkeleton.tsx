import { Skeleton } from "@/components/ui/skeleton";
import { ConsentListSkeleton } from "./ConsentListSkeleton";

export default function ConsentFormsPageSkeleton() {
  return (
    <>

      <div className="w-full flex justify-between items-center mb-8 p-4">
        <div className="h-8 bg-transparent rounded w-1/3" />
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
          <div className="h-12 w-12 bg-gray-200 rounded-full" />
        </div>
      </div>
      <div className="container mx-auto mt-15">
        {/* Title and Add Button Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-4 gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-12 w-40" />
        </div>

        {/* Data Table */}
        <ConsentListSkeleton />
      </div>
    </>
  );
}
