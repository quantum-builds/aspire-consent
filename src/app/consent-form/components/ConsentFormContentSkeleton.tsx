import { Skeleton } from "@/components/ui/skeleton";

export default function ConsentFormContentSkeleton() {
  // Create an array to represent loading questions
  const loadingQuestions = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      {/* Logo Skeleton */}
      {/* <Skeleton className="h-10 w-36" /> */}

      {/* Introduction Box Skeleton */}
      <div className="py-10 px-10 bg-gray-100 rounded-lg shadow-sm border border-gray-200 mt-22">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-6 w-full mb-3" />
        <Skeleton className="h-6 w-5/6" />
      </div>

      {/* Form Container Skeleton */}
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-6">
          {/* Questions Skeleton */}
          {loadingQuestions.map((_, index) => (
            <div key={index} className="p-4 border rounded-md border-gray-200">
              {/* Question Text */}
              <Skeleton className="h-6 w-full mb-3" />

              {/* Options */}
              <div className="space-y-2 mb-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-5 w-64" />
                    </div>
                    <Skeleton className="h-5 w-5" />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-4">
                <Skeleton className="h-5 w-16" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}

          {/* Consent Checkbox */}
          <div className="mt-6 flex items-start gap-2">
            <Skeleton className="h-5 w-5 mt-0.5" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          {/* Form Buttons */}
          <div className="flex justify-between gap-2 mt-6">
            <Skeleton className="h-10 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
