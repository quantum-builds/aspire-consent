import { Skeleton } from "@/components/ui/skeleton"

export default function ViewProcedureWrapperSkeleton() {
  const placeholderQuestions = Array.from({ length: 4 })

  return (
    <div>
      {/* Header */}
      <div className="flex justify-end items-center mb-5 mt-4 lg:mt-0">
        <div className="flex items-center gap-7">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col max-w-6xl mx-auto">
        {/* Page title */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>

        {/* Questions list */}
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-6">
          {placeholderQuestions.map((_, idx) => (
            <div key={idx} className="p-4 border rounded-md space-y-4">
              {/* Question */}
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-20" />
              </div>

              {/* Options */}
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-5 w-5 rounded" />
                  </div>
                ))}
              </div>

              {/* Bottom row */}
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-4 w-24" />
              </div>


            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
