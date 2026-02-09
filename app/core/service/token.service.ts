import type { Token } from '~type/auth.type';

class TokenService {
    getToken(): Token | null {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (!accessToken || !refreshToken) return null;
        return { accessToken, refreshToken };
    }

    setToken({ accessToken, refreshToken }: Token) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    }

    removeToken() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
}

export default new TokenService();
