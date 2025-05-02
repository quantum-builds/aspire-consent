import { Skeleton } from "@/components/ui/skeleton";

export default function ConsentFormSkeleton() {
  return (
    <div className="container mx-auto mt-15">
      {/* Back Link and Title Section */}
      <div className="flex gap-5 mb-8">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="w-full p-4 space-y-6">
        <div className="flex flex-col gap-7">
          <div className="border p-3 md:p-8 lg:p-14 rounded-lg">
            <div className="flex flex-col gap-12">
              {/* Patient Selection */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <Skeleton className="h-7 w-48" />
                <div className="flex flex-col gap-3 w-full md:w-2/3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-5 w-64" />
                </div>
              </div>

              {/* Treatment Selection */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <Skeleton className="h-7 w-48" />
                <div className="flex flex-col gap-3 w-full md:w-2/3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-5 w-96" />
                </div>
              </div>

              {/* Treatment Date */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <Skeleton className="h-7 w-48" />
                <div className="flex flex-col gap-3 w-full md:w-2/3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-5 w-96" />
                </div>
              </div>

              {/* Separator */}
              <Skeleton className="h-px w-full" />

              {/* Custom Note */}
              <div className="flex flex-col gap-4">
                <Skeleton className="h-7 w-48" />
                <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                  <Skeleton className="h-5 w-full md:w-1/3" />
                  <div className="flex flex-col w-full md:w-2/3 gap-4">
                    <Skeleton className="min-h-[200px] w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end gap-6">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
