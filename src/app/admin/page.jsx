'use client';

import { useState } from 'react';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Password: pepeline2026 (cambiala!)
        if (password === 'pepeline2026') {
            setAuthenticated(true);
        } else {
            alert('❌ Password errata!');
        }
    };

    if (!authenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">🔒 Admin Access</h1>
                        <p className="text-gray-400">Enter password to continue</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full p-4 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                        >
                            🔓 Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return <AdminDashboard />;
}
