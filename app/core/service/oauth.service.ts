import type { Token } from '~type/auth.type';
import type { ReturnWithErrPromise } from '~type/common.type';

import { apiClient } from '~api/apiClient';
import { HttpException, errorHandler, isHttpException } from '~helper/error-handler';

class GoogleOAuthService {
    async getUrl(): ReturnWithErrPromise<string> {
        try {
            const response = await apiClient.get<{ url: string }>('/auth/google/url');
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data.url, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async signIn(code: string): ReturnWithErrPromise<Token> {
        try {
            const response = await apiClient.post<Token>('/auth/google/callback', { code });
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export const googleOAuthService = new GoogleOAuthService();
