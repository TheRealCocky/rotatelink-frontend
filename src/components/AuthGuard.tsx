"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTokenValid } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!isTokenValid(token)) {
            localStorage.removeItem("token"); // limpa token inválido
            router.replace("/auth/login"); // redireciona
        }
    }, [router]);

    return <>{children}</>;
}
