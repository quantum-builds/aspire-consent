"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function LoginSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <Skeleton className="h-12 w-32 mb-2 mx-auto" />
          <Skeleton className="h-8 w-48 mt-6" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>

        <div className="bg-gray-100 p-1 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-1">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-4 w-32" />
          </div>

          <div>
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="text-center">
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
