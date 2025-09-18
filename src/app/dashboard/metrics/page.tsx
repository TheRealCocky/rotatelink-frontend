'use client';
import { useEffect, useState } from 'react';
import { getMetrics } from '@/server/api';
import { useSearchParams } from 'next/navigation';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

export default function Page() {
    const [metrics, setMetrics] = useState<any>(null);
    const searchParams = useSearchParams();
    const linkId = searchParams.get('id');
    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (linkId && token) {
            getMetrics(token, linkId).then(setMetrics);
        }
    }, [linkId, token]);

    if (!metrics) return <div className="text-center mt-10">Loading...</div>;

    // preparar dados para o gráfico
    const chartData = metrics.clicksPerUrl.map((c: number, i: number) => ({
        name: `Alt ${i + 1}`,
        clicks: c,
    }));

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">📊 Link Metrics</h1>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <h2 className="text-gray-600">Total Clicks</h2>
                    <p className="text-2xl font-bold text-blue-600">
                        {metrics.accessCount}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <h2 className="text-gray-600">Alternative Links</h2>
                    <p className="text-2xl font-bold text-green-600">
                        {metrics.clicksPerUrl.length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <h2 className="text-gray-600">Most Clicked</h2>
                    <p className="text-2xl font-bold text-purple-600">
                        {Math.max(...metrics.clicksPerUrl)}
                    </p>
                </div>
            </div>

            {/* Gráfico */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Clicks per Alternative</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="clicks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

