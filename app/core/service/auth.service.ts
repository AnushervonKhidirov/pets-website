import type { SignInDto, SignUpDto, Token } from '~type/auth.type';
import type { ReturnWithErrPromise } from '~type/common.type';

import { apiClient } from '~api/apiClient';
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

    async signOut() {
        try {
        } catch (err) {
            return errorHandler(err);
        }
    }

    async signOutEverywhere() {
        try {
        } catch (err) {
            return errorHandler(err);
        }
    }

    async oAuth() {
        try {
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export default new AuthService();
