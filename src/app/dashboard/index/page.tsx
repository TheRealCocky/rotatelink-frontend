'use client';
import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

// Mock data (replace later with API data)
const mockData = [
    { name: 'Link A', clicks: 120 },
    { name: 'Link B', clicks: 80 },
    { name: 'Link C', clicks: 150 },
    { name: 'Link D', clicks: 60 },
];

export default function DashboardPage() {
    const [links] = useState(mockData);

    // Helper values
    const totalClicks = links.reduce((acc, l) => acc + l.clicks, 0);
    const topLink = links.reduce((top, curr) =>
        curr.clicks > top.clicks ? curr : top
    );
    const avgClicks = Math.round(totalClicks / links.length);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">
                    Gain insights into your links: monitor total clicks, identify your top
                    performers, and track engagement trends over time.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-gray-700">Total Links</h3>
                    <p className="text-3xl font-bold mt-2 text-blue-600">
                        {links.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Links you have created so far
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-gray-700">Total Clicks</h3>
                    <p className="text-3xl font-bold mt-2 text-green-600">
                        {totalClicks}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Combined clicks across all your links
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-gray-700">Top Link</h3>
                    <p className="text-lg font-bold mt-2 text-purple-600">
                        {topLink.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Most popular link with {topLink.clicks} clicks
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Average Clicks
                    </h3>
                    <p className="text-3xl font-bold mt-2 text-orange-600">{avgClicks}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Average engagement per link
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Clicks per Link
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={links}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                            formatter={(value) => [`${value} clicks`, 'Engagement']}
                        />
                        <Bar dataKey="clicks" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-500 mt-3">
                    This chart helps you quickly identify which links drive the most
                    engagement.
                </p>
            </div>
        </div>
    );
}




