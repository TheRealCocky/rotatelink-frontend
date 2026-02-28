// Se está em localhost -> usa porta 3001
// Caso contrário (produção) -> usa o backend do Render
const BASE_URL =
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:3001'
        : 'https://linkrotatorserver.onrender.com';

export async function register(username: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return res.json();
}

export async function login(username: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("username", data.username);
    }

    return data;
}



export async function createLink(
    token: string,
    originalUrl: string,
    alternativeUrls: string[],
    weights?: number[],
) {
    const res = await fetch(`${BASE_URL}/links`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ originalUrl, alternativeUrls, weights }),
    });
    return res.json();
}

export async function getLinks() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Usuário não autenticado");

    const res = await fetch(`${BASE_URL}/links`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao buscar links");
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
        throw new Error("Resposta inesperada da API de links");
    }

    return data;
}



export async function getMetrics(token: string, linkId: string) {
    const res = await fetch(`${BASE_URL}/links/${linkId}/metrics`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

export async function rotateLink(linkId: string) {
    const res = await fetch(`${BASE_URL}/links/${linkId}/rotate`, {
        redirect: 'follow',
    });
    return res.url; // URL final após redirecionamento
}

