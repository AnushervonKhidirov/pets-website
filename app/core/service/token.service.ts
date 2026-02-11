import type { Token } from '~type/auth.type';
import { TokenName } from '~constant/token';

class TokenService {
    getToken(): Token | null {
        const accessToken = localStorage.getItem(TokenName.Access);
        const refreshToken = localStorage.getItem(TokenName.Refresh);

        if (!accessToken || !refreshToken) return null;
        return { accessToken, refreshToken };
    }

    setToken({ accessToken, refreshToken }: Token) {
        localStorage.setItem(TokenName.Access, accessToken);
        localStorage.setItem(TokenName.Refresh, refreshToken);
    }

    removeToken() {
        localStorage.removeItem(TokenName.Access);
        localStorage.removeItem(TokenName.Refresh);
    }
}

export default new TokenService();
