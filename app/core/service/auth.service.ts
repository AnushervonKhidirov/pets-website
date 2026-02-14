import type { SignInDto, SignUpDto, RefreshTokenDto, Token } from '~type/auth.type';
import type { ReturnWithErrPromise } from '~type/common.type';

import { apiClient } from '~api/api-client';
import { HttpException, errorHandler, isHttpException } from '~helper/error-handler';

class AuthService {
    async signIn(data: SignInDto): ReturnWithErrPromise<Token> {
        try {
            const response = await apiClient.post<Token>('/auth/sign-in', data);
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async signUp(data: SignUpDto): ReturnWithErrPromise<Token> {
        try {
            const response = await apiClient.post<Token>('/auth/sign-up', data);
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async signOut(data: RefreshTokenDto, allDevices?: boolean): ReturnWithErrPromise {
        try {
            const endpoint = allDevices ? '/auth/sign-out-everywhere' : '/auth/sign-out';
            const response = await apiClient.post(endpoint, data);
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [null, null];
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export default new AuthService();
