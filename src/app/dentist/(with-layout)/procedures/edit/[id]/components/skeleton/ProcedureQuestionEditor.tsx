export default function ProcedureSkeleton() {
    return (
        <div className="max-w-6xl mx-auto p-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex justify-between items-center mb-8">
                <div className="h-8 bg-gray-200 rounded w-1/3" />
                <div className="flex items-center gap-4">
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                </div>
            </div>

            {/* Card skeleton for Procedure Details */}
            <div className="border border-gray-200 rounded-xl shadow-sm mb-8">
                <div className="bg-gray-100 h-12 rounded-t-xl" />
                <div className="p-6 space-y-6">
                    <div>
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                        <div className="h-10 bg-gray-200 rounded w-full" />
                    </div>
                    <div>
                        <div className="h-5 bg-gray-200 rounded w-1/4 mb-3" />
                        <div className="h-32 bg-gray-200 rounded w-full" />
                    </div>
                </div>
            </div>

            {/* Question cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((_, index) => (
                    <div
                        key={index}
                        className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <div className="h-5 bg-gray-200 rounded w-2/3" />
                            <div className="h-6 w-6 bg-gray-200 rounded-full" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-4 bg-gray-200 rounded w-4/6" />
                        </div>
                        <div className="h-40 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>

            {/* Footer skeleton (button area) */}
            <div className="mt-8 flex justify-end">
                <div className="h-10 bg-gray-200 rounded w-32" />
            </div>
        </div>
    );
}
