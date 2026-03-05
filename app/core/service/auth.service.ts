import type { SignInDto, SignUpDto, RefreshTokenDto, Token } from '~type/auth.type';
import type { ReturnWithErrPromise } from '~type/common.type';

import { join } from '~helper/path.helper';
import { apiClient } from '~api/api-client';
import { HttpException, errorHandler, isHttpException } from '~helper/error-handler';

class AuthService {
    private readonly endpoint = 'auth';

    async signIn(data: SignInDto): ReturnWithErrPromise<Token> {
        try {
            const response = await apiClient.post<Token>(join(this.endpoint, 'sign-in'), data);
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async signUp(data: SignUpDto): ReturnWithErrPromise<Token> {
        try {
            const response = await apiClient.post<Token>(join(this.endpoint, 'sign-up'), data);
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async signOut(data: RefreshTokenDto, allDevices?: boolean): ReturnWithErrPromise {
        try {
            const signOutType = allDevices ? 'sign-out-everywhere' : 'sign-out';
            const response = await apiClient.post(join(this.endpoint, signOutType), data);
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [null, null];
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export default new AuthService();
