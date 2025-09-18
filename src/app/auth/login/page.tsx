'use client';
import { useState } from 'react';
import { login } from '@/server/api';
import { useRouter } from 'next/navigation';

export default function Page() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        const res = await login(username, password);
        if (res.access_token) {
            localStorage.setItem('token', res.access_token);
            router.push('/dashboard/index');
        } else {
            alert('Page failed: check username/password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <div className="flex flex-col gap-4">
                    <input
                        className="border p-2 rounded"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        className="border p-2 rounded"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                    <p className="text-sm text-center mt-2">
                        Don’t have an account?{' '}
                        <a href="/auth/register" className="text-blue-600 hover:underline">
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
