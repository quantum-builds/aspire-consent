import { Skeleton } from "@/components/ui/skeleton"

export default function ConsentFormViewerSkeleton() {
    const placeholderQuestions = Array.from({ length: 4 })

    return (
        <div className="flex flex-col gap-10 w-full p-4">
            {/* Header Section */}
            <div className="w-full flex justify-between items-center mb-8">
                <div className="h-8 bg-transparent rounded w-1/3" />
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full" />
                    <div className="h-12 w-12 bg-gray-200 rounded-full" />
                </div>
            </div>
            <div className="max-w-6xl mx-auto w-full rounded-lg border border-gray-200 shadow-sm p-6 bg-white">
                <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-36" />
                    </div>
                </div>
            </div>

            {/* Questions List Section */}
            <div className="max-w-6xl mx-auto w-full p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-6">
                {placeholderQuestions.map((_, idx) => (
                    <div key={idx} className="p-4 border rounded-md space-y-3">
                        {/* Question */}
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-16" />
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

            {/* Download button section */}
            <div className=" max-w-6xl flex justify-end">
                <Skeleton className="h-10 w-56 rounded-md" />
            </div>
        </div>
    )
}
