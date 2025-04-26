const DashboardSkeleton = () => {
    return (
        <div className="p-6 bg-gray-100">
            <div className=" mx-auto space-y-8">
                {/* Skeleton for Pie Charts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-4 sm:p-6 animate-pulse"
                        >
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                            <div className="h-48 sm:h-56 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>

                {/* Skeleton for Line Chart */}
                <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-64 sm:h-80 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;