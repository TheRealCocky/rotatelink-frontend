import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp: number;
    [key: string]: any;
}

export function isTokenValid(token: string | null): boolean {
    if (!token) return false;
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (!decoded.exp) return false;
        const now = Date.now() / 1000; // seconds
        return decoded.exp > now;
    } catch {
        return false;
    }
}

