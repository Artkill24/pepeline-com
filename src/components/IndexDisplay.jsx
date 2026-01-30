'use client';

export default function IndexDisplay({ data }) {
    if (!data) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin text-6xl">🐸</div>
                <p className="mt-4 text-gray-400">Loading Pepeline Index...</p>
            </div>
        );
    }

    const { index, level, components, timestamp } = data;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <div className="text-8xl mb-4">{level.emoji}</div>
                <h1 className="text-7xl font-bold mb-2">
                    {index}
                </h1>
                <p className={`text-2xl font-semibold text-${level.color}`}>
                    {level.label}
                </p>
                <p className="text-xl text-gray-400 mt-4 italic">
                    "{level.message}"
                </p>
            </div>

            <div className="mb-12">
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className={`h-full bg-${level.color} transition-all duration-1000`}
                        style={{ width: `${index}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0 Calm</span>
                    <span>50 Active</span>
                    <span>100 Peak Degen</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Object.entries(components).map(([key, value]) => (
                    <div key={key} className="bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold mb-1">{value}</div>
                        <div className="text-sm text-gray-400 capitalize">{key}</div>
                    </div>
                ))}
            </div>

            <p className="text-center text-sm text-gray-500">
                Last update: {new Date(timestamp).toLocaleString()}
            </p>
        </div>
    );
}
