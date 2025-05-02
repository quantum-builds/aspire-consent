"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SideBarSkeleton() {
  return (
    <div className="bg-[#5353FF] w-full h-screen px-6 py-8 flex flex-col z-50 sticky top-0 overflow-y-auto">
      {/* Logo Skeleton */}
      <div className="mb-10 flex items-center justify-center">
        <Skeleton className="h-[50px] w-[190px] rounded-md" />
      </div>

      {/* Practice Selector Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="bg-[#4747E5] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <div className="mt-2 flex items-start gap-1.5">
            <Skeleton className="h-3.5 w-3.5 rounded-full mt-0.5" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>

      {/* Navigation Links Skeleton */}
      <div className="flex flex-col gap-4 mb-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-4 py-3 rounded-lg"
          >
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PracticeDropdownSkeleton() {
  return (
    <div className="mt-2 bg-[#4747E5] rounded-lg overflow-hidden shadow-lg border border-[#6969FF]">
      {/* Add Practice Option Skeleton */}
      <div className="p-3 border-b border-[#6969FF] flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-5 w-40" />
      </div>

      {/* Practice List Skeleton */}
      <div className="max-h-60 overflow-y-auto">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-3 flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-5 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
