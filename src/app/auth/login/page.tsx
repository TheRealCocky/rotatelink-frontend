'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('https://linkmetrics-backend-9p95.onrender.com/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                throw new Error('Login failed');
            }

            const data = await res.json();
            localStorage.setItem('token', data.accessToken);
            router.push('/dashboard/index');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-6 dark:text-black">🔐 Login</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 rounded w-full mb-4 dark:text-black"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded w-full mb-4 dark:text-black"
            />

            <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Carregando...' : 'Entrar'}
            </button>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>
    );
}

