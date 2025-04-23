import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionFormSkeleton() {
  // Create an array to represent loading questions
  const loadingQuestions = Array.from({ length: 2 }, (_, i) => i);

  return (
    <div className="space-y-6">
      {/* Progress Bar Skeleton */}
      <div className="bg-gray-100 h-2 rounded-full w-full mb-6">
        <div className="bg-gray-200 h-2 rounded-full w-1/3 animate-pulse" />
      </div>

      <Card className="bg-white rounded-lg shadow p-6 mb-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-semibold">
            <Skeleton className="h-7 w-64" />
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-4 space-y-8 grid grid-cols-2">
          {loadingQuestions.map((_, questionIndex) => (
            <div
              key={questionIndex}
              className={questionIndex > 0 ? "border-t pt-6 mt-6" : ""}
            >
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>

              {/* Question Text Skeleton */}
              <div className="mb-4 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>

              {/* Options Skeleton */}
              <div className="space-y-4 mb-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-28" />
                </div>

                {/* Option Items */}
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-10 text-center">
                      <Skeleton className="h-5 w-5 mx-auto" />
                    </div>
                    <div className="flex-1">
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>

              {/* Correct Answer Skeleton */}
              <div className="mb-4 space-y-3">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-5 w-5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <Skeleton className="h-10 w-40" />
            <div className="space-x-2">
              <Skeleton className="h-10 w-24 inline-block" />
              <Skeleton className="h-10 w-36 inline-block" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
