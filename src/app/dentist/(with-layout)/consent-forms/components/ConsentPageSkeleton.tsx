import { Skeleton } from "@/components/ui/skeleton";
import { ConsentListSkeleton } from "./ConsentListSkeleton";

export default function ConsentFormsPageSkeleton() {
  return (
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
  );
}
