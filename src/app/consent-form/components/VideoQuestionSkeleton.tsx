import { Skeleton } from "@/components/ui/skeleton";

export function VideoQuestionViewerSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-12">
      <main className="container mx-auto px-4 py-2 flex-grow flex flex-col lg:flex-row gap-6">
        {/* Left sidebar skeleton */}
        <div className="flex flex-col gap-6">
          <div className="lg:w-72 flex-shrink-0">
            <div className="flex flex-col gap-7 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              {/* Header section */}
              <div>
                <Skeleton className="h-8 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full" />
              </div>

              {/* Status badge */}
              <Skeleton className="h-6 w-24 rounded-md" />

              {/* Consent information section */}
              <div>
                <Skeleton className="h-6 w-3/4 mb-4" />
                <div className="space-y-4">
                  {/* Patient info */}
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                  </div>

                  {/* Dentist info */}
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>

                  {/* Expires info */}
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>

                  {/* Videos count */}
                  <div className="pt-2">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-grow flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex flex-col gap-7">
            {/* Video header */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-20" />
              </div>

              {/* Video placeholder */}
              <div className="h-[60vh] relative rounded-lg border border-gray-200 shadow-sm bg-gray-200 overflow-hidden flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            </div>

            {/* Navigation controls */}
            <div className="flex justify-between items-center">
              <div className="flex-1" />

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 flex-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-3 h-3 rounded-full" />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex-1 flex flex-row items-center gap-4 justify-end">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
