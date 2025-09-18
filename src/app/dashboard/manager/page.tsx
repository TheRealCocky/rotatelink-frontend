'use client';
import { useEffect, useState } from 'react';
import { getLinks, getMetrics } from '@/server/api';
import { Copy, RefreshCcw, BarChart3, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

export default function Page() {
    const [links, setLinks] = useState<any[]>([]);
    const [loadingLinks, setLoadingLinks] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState<any | null>(null);
    const [metrics, setMetrics] = useState<any | null>(null);
    const [loadingMetrics, setLoadingMetrics] = useState(false);

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const load = async () => {
            if (!token) {
                toast.error('Login required.');
                setLoadingLinks(false);
                return;
            }
            try {
                setLoadingLinks(true);
                const data = await getLinks(token);
                setLinks(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load links.');
                setLinks([]);
            } finally {
                setLoadingLinks(false);
            }
        };
        load();
    }, [token]);

    const handleCopy = async (id: string) => {
        try {
            const url = `${
                process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
            }/links/${id}/rotate`;
            await navigator.clipboard.writeText(url);
            setCopiedId(id);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error(err);
            toast.error('Failed to copy link');
        }
    };

    const handleRotate = (id: string) => {
        const url = `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        }/links/${id}/rotate`;
        window.open(url, '_blank', 'noopener,noreferrer');
        toast('Opening rotate...', { icon: '🔀' });
    };

    // Abre modal e busca métricas (GET /links/:id/metrics)
    const openMetrics = async (link: any) => {
        setSelectedLink(link);
        setModalOpen(true);
        setLoadingMetrics(true);
        setMetrics(null);
        try {
            if (!token) throw new Error('No token');
            const data = await getMetrics(token, link.id);
            setMetrics(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load metrics.');
            setMetrics(null);
        } finally {
            setLoadingMetrics(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedLink(null);
        setMetrics(null);
        setLoadingMetrics(false);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">🔗 Manage Your Links</h1>

            {loadingLinks ? (
                <p className="text-center">Loading links...</p>
            ) : links.length === 0 ? (
                <p className="text-center">No links created yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left">Original URL</th>
                            <th className="px-4 py-3 text-left">Alternatives</th>
                            <th className="px-4 py-3 text-center">Clicks</th>
                            <th className="px-4 py-3 text-center">Created At</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {links.map((link) => (
                            <tr
                                key={link.id}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3 truncate max-w-xs">
                                    <a
                                        href={
                                            link.originalUrl.startsWith('http')
                                                ? link.originalUrl
                                                : `https://${link.originalUrl}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {link.originalUrl}
                                    </a>
                                </td>

                                <td className="px-4 py-3">
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {Array.isArray(link.alternativeUrls) &&
                                            link.alternativeUrls
                                                .slice(0, 3)
                                                .map((alt: string, i: number) => (
                                                    <li key={i} className="truncate max-w-xs">
                                                        <a
                                                            href={alt}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:underline"
                                                        >
                                                            {alt}
                                                        </a>
                                                    </li>
                                                ))}
                                        {Array.isArray(link.alternativeUrls) &&
                                            link.alternativeUrls.length > 3 && (
                                                <li className="text-gray-400">
                                                    +{link.alternativeUrls.length - 3} more
                                                </li>
                                            )}
                                    </ul>
                                </td>

                                <td className="px-4 py-3 text-center font-semibold">
                                    {link.accessCount ?? 0}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {link.createdAt
                                        ? new Date(link.createdAt).toLocaleDateString()
                                        : '-'}
                                </td>

                                <td className="px-4 py-3 flex gap-2 justify-center">
                                    <button
                                        onClick={() => handleCopy(link.id)}
                                        className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm transition"
                                    >
                                        <Copy className="w-4 h-4" />
                                        {copiedId === link.id ? 'Copied' : 'Copy'}
                                    </button>

                                    <button
                                        onClick={() => handleRotate(link.id)}
                                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                                    >
                                        <RefreshCcw className="w-4 h-4" /> Rotate
                                    </button>

                                    <button
                                        onClick={() => openMetrics(link)}
                                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                                    >
                                        <BarChart3 className="w-4 h-4" /> Metrics
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={closeModal}
                        aria-hidden
                    />
                    <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-xl shadow-lg overflow-auto max-h-[85vh]">
                        <div className="flex items-center justify-between p-4 border-b">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Metrics — {selectedLink?.originalUrl}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Detailed metrics for this rotating link
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 rounded hover:bg-gray-100"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {loadingMetrics ? (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded">
                                        <svg
                                            className="w-5 h-5 animate-spin"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8z"
                                            ></path>
                                        </svg>
                                        <span>Loading metrics...</span>
                                    </div>
                                </div>
                            ) : metrics ? (
                                <>
                                    {/* Summary cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-gray-50 p-4 rounded">
                                            <div className="text-sm text-gray-600">Total Clicks</div>
                                            <div className="text-xl font-bold">
                                                {metrics.accessCount ?? 0}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded">
                                            <div className="text-sm text-gray-600">Alternatives</div>
                                            <div className="text-xl font-bold">
                                                {metrics.alternativeUrls?.length ?? 0}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded">
                                            <div className="text-sm text-gray-600">Created</div>
                                            <div className="text-sm">
                                                {metrics.createdAt
                                                    ? new Date(metrics.createdAt).toLocaleString()
                                                    : '-'}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded">
                                            <div className="text-sm text-gray-600">Last updated</div>
                                            <div className="text-sm">
                                                {metrics.updatedAt
                                                    ? new Date(metrics.updatedAt).toLocaleString()
                                                    : '-'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chart */}
                                    <div className="bg-white p-4 rounded shadow">
                                        <h3 className="font-semibold mb-3">
                                            Clicks by alternative
                                        </h3>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <BarChart
                                                data={
                                                    Array.isArray(metrics.alternativeUrls)
                                                        ? metrics.alternativeUrls.map(
                                                            (url: string, i: number) => ({
                                                                name: url,
                                                                clicks: metrics.clicksPerUrl?.[i] ?? 0,
                                                            })
                                                        )
                                                        : []
                                                }
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="name"
                                                    tickFormatter={(v) =>
                                                        v.length > 20 ? v.slice(0, 17) + '...' : v
                                                    }
                                                />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip
                                                    formatter={(value) => [`${value} clicks`, 'Clicks']}
                                                />
                                                <Bar
                                                    dataKey="clicks"
                                                    fill="#3b82f6"
                                                    radius={[6, 6, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Alternatives table */}
                                    <div className="bg-white p-4 rounded shadow">
                                        <h3 className="font-semibold mb-3">Alternative URLs</h3>
                                        <table className="w-full text-left">
                                            <thead>
                                            <tr className="text-sm text-gray-600 border-b">
                                                <th className="py-2 px-3">URL</th>
                                                <th className="py-2 px-3 text-center">Clicks</th>
                                                <th className="py-2 px-3 text-right">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {metrics.alternativeUrls.map(
                                                (url: string, i: number) => (
                                                    <tr key={i} className="border-b hover:bg-gray-50">
                                                        <td className="py-2 px-3">
                                                            <a
                                                                href={url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {url}
                                                            </a>
                                                        </td>
                                                        <td className="py-2 px-3 text-center font-semibold">
                                                            {metrics.clicksPerUrl?.[i] ?? 0}
                                                        </td>
                                                        <td className="py-2 px-3 text-right">
                                                            <div className="inline-flex gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(url);
                                                                        toast.success('Alternative copied!');
                                                                    }}
                                                                    className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                                                                >
                                                                    <Copy className="w-4 h-4 inline-block mr-1" />{' '}
                                                                    Copy
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        window.open(
                                                                            url,
                                                                            '_blank',
                                                                            'noopener,noreferrer'
                                                                        )
                                                                    }
                                                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                                                >
                                                                    <RefreshCcw className="w-4 h-4 inline-block mr-1" />{' '}
                                                                    Open
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-red-600">No metrics available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}




