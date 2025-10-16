import { Skeleton } from "@/components/ui/skeleton";

export default function ConsentFormEditorSkeleton() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 mt-10">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 bg-transparent rounded w-1/3" />
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>
      </div>

      <div className="border rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4 px-4">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="p-6 space-y-6">
          {/* Patient and Procedure */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Expiration date */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-64" />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 border border-gray-100 bg-gray-50 p-4 rounded-md">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>
      </div>

      {/* MCQ Editor Section */}
      <div className="flex flex-col gap-8">
        {Array.from({ length: 2 }).map((_, qIndex) => (
          <div
            key={qIndex}
            className="p-6 border rounded-lg shadow-sm bg-white relative"
          >
            <div className="absolute top-3 right-3">
              <Skeleton className="h-5 w-20" />
            </div>

            {/* Question Input */}
            <div className="mb-4 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Options */}
            <div className="space-y-4 mb-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>

              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-4" />
                </div>
              ))}
            </div>

            {/* Video Upload */}
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full rounded-md" />
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <div className="flex justify-end mt-6">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end mt-4">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
