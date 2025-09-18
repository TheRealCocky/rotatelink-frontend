'use client';

import Link from "next/link";
import { Home, LinkIcon, BarChart2, LogOut } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/auth/login");
    };

    return (
        <AuthGuard>
        <div className="flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 w-64 h-screen bg-gray-900 text-white flex flex-col shadow-xl">
                <h1 className="text-2xl font-bold mb-8 p-4">Dashboard</h1>
                <nav className="flex flex-col gap-2 flex-1 px-4">
                    <Link
                        href="/dashboard/index"
                        className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded"
                    >
                        <Home size={20} /> Home
                    </Link>
                    <Link
                        href="/dashboard/links"
                        className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded"
                    >
                        <LinkIcon size={20} /> Create Link
                    </Link>
                    <Link
                        href="/dashboard/manager"
                        className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded"
                    >
                        <BarChart2 size={20} /> Manage Links
                    </Link>
                </nav>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded mt-auto mx-4 mb-4 text-left"
                >
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Conteúdo principal */}
            <main className="ml-64 flex-1 p-6 bg-gray-100 min-h-screen">
                {children}
                <Toaster position="top-right" />
            </main>
        </div>
            </AuthGuard>
    );
}


