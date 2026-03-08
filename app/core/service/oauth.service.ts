import type { Token } from '~type/auth.type';

import { join } from '~helper/path.helper';
import { apiClient } from '~api/api-client';
import { HttpException, isHttpException } from '~helper/error-handler';

class GoogleOAuthService {
    private readonly endpoint = '/auth/google/';

    async getUrl(): Promise<string> {
        const response = await apiClient.get<{ url: string }>(join(this.endpoint, 'url'));
        if (isHttpException(response.data)) throw new HttpException(response.data);
        return response.data.url;
    }

    async signIn(code: string): Promise<Token> {
        const response = await apiClient.post<Token>(join(this.endpoint, 'callback'), { code });
        if (isHttpException(response.data)) throw new HttpException(response.data);
        return response.data;
    }
}

export const googleOAuthService = new GoogleOAuthService();
