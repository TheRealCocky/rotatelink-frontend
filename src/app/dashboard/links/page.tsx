'use client';
import { useState } from 'react';
import { createLink } from '@/server/api';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function Page() {
    const [originalUrl, setOriginalUrl] = useState('');
    const [alternatives, setAlternatives] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;
    const router = useRouter();

    const handleCreate = async () => {
        if (!token) return alert('⚠️ No token found. Please login.');
        setLoading(true);
        try {
            const altArray = alternatives.split(',').map(s => s.trim()).filter(Boolean);
            await createLink(token, originalUrl, altArray);
            setSuccess(true);

            // espera 1.5s antes de redirecionar
            setTimeout(() => {
                router.push('/dashboard/index');
            }, 1500);
        } catch (err) {
            alert('❌ Error creating link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Link</h1>

            <div className="flex flex-col gap-5">
                {/* Original URL */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Original URL</label>
                    <input
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="https://example.com"
                        value={originalUrl}
                        onChange={e => setOriginalUrl(e.target.value)}
                    />
                </div>

                {/* Alternatives */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Alternative URLs</label>
                    <input
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="https://alt1.com, https://alt2.com"
                        value={alternatives}
                        onChange={e => setAlternatives(e.target.value)}
                    />
                    <span className="text-xs text-gray-500 mt-1">Separate by commas</span>
                </div>

                {/* Botão */}
                <button
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    onClick={handleCreate}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Link"}
                </button>
            </div>

            {/* Mensagem de sucesso */}
            {success && (
                <div className="mt-5 flex items-center gap-2 text-green-600 font-semibold bg-green-50 border border-green-200 p-3 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Link created! Redirecting...</span>
                </div>
            )}
        </div>
    );
}


