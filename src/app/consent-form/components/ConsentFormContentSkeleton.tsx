import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ConsentFormContentSkeleton() {
  return (
    <div className="flex flex-col gap-4 my-auto max-w-2xl mx-auto mt-12">
      <div className="text-center">
        <Skeleton className="h-8 w-64 mx-auto mb-2" />
      </div>

      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          {/* Header with progress bar */}
          <div className="flex items-center gap-2 px-6 pb-2 pt-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>

          {/* Progress bar */}
          <div className="relative h-1.5 bg-gray-100 rounded-full mx-6 mb-4">
            <Skeleton className="h-full w-1/3 rounded-full" />
          </div>

          <div className="px-6 py-2">
            {/* Save progress button */}
            <div className="flex justify-end items-center mb-6">
              <Skeleton className="h-8 w-28" />
            </div>

            {/* Question content */}
            <div className="relative min-h-[400px]">
              {/* Question title */}
              <Skeleton className="h-7 w-full mb-6" />

              {/* Options */}
              <div className="space-y-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Footer with navigation */}
          <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <Skeleton className="h-9 w-28" />

              <div className="flex gap-3">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
