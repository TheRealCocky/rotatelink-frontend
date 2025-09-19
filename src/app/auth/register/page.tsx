'use client';
import { useState } from 'react';
import { register } from '@/server/api';
import { useRouter } from 'next/navigation';

export default function Page() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        const res = await register(username, password);
        if (res.id) {
            alert('Registration successful! Please login.');
            router.push('/auth/login');
        } else {
            alert('Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
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
                        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                    <p className="text-sm text-center mt-2">
                        Already have an account?{' '}
                        <a href="/auth/login" className="text-blue-600 hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
