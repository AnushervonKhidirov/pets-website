import type { Token } from '~type/auth.type';
import type { ReturnWithErrPromise } from '~type/common.type';

import { join } from '~helper/path.helper';
import { apiClient } from '~api/api-client';
import { HttpException, errorHandler, isHttpException } from '~helper/error-handler';

class GoogleOAuthService {
    private readonly endpoint = '/auth/google/';

    async getUrl(): ReturnWithErrPromise<string> {
        try {
            const response = await apiClient.get<{ url: string }>(join(this.endpoint, 'url'));
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data.url, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async signIn(code: string): ReturnWithErrPromise<Token> {
        try {
            const response = await apiClient.post<Token>(join(this.endpoint, 'callback'), { code });
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export const googleOAuthService = new GoogleOAuthService();
