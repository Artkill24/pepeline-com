'use client';

export function IndexSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-64 bg-gray-800 rounded-xl mb-8"></div>
            <div className="grid grid-cols-3 gap-4">
                {[1,2,3].map(i => (
                    <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
                ))}
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="animate-pulse p-6 bg-gray-800 rounded-xl">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }) {
    return (
        <div className="animate-pulse space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                    <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-700 rounded"></div>
                </div>
            ))}
        </div>
    );
}
