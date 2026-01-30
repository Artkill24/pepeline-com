'use client';

import { useState } from 'react';

export default function ShareButton({ index, level }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const text = `🐸 Pepeline Index: ${index}\n${level.emoji} ${level.label}\n"${level.message}"\n\nCheck it live: pepeline.com`;
        
        // Try native share first (mobile)
        if (navigator.share) {
            try {
                await navigator.share({ text });
                return;
            } catch (err) {
                // Fallback to clipboard
            }
        }

        // Clipboard fallback
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button 
            onClick={handleShare}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition inline-flex items-center gap-2"
        >
            {copied ? (
                <>
                    <span>✓</span>
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <span>📤</span>
                    <span>Share Index</span>
                </>
            )}
        </button>
    );
}
