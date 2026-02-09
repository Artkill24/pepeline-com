'use client';

import { useEffect, useState } from 'react';

export default function PepelineWidget({ 
    size = 'medium', // small, medium, large
    theme = 'dark', 
    apiUrl = 'https://pepeline.com'
}) {
    const [index, setIndex] = useState(null);

    useEffect(() => {
        fetchIndex();
        const interval = setInterval(fetchIndex, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchIndex = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/index`);
            const data = await res.json();
            setIndex(data);
        } catch (error) {
            console.error('Widget fetch error:', error);
        }
    };

    const sizes = {
        small: 'w-48 h-24',
        medium: 'w-64 h-32',
        large: 'w-80 h-40'
    };

    if (!index) {
        return (
            <div className={`${sizes[size]} ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg animate-pulse`}></div>
        );
    }

    return (
        <div className={`${sizes[size]} ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl p-4 border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between h-full">
                <div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Pepeline Index
                    </p>
                    <p className="text-4xl font-bold">{index.index}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                        {index.level}
                    </p>
                </div>
                <div className="text-5xl">
                    {index.emoji}
                </div>
            </div>
            <a 
                href="https://pepeline.com" 
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} hover:underline mt-2 block`}
            >
                Powered by Pepeline
            </a>
        </div>
    );
}
