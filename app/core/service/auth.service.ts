import type { SignInDto, SignUpDto, RefreshTokenDto, Token } from '~type/auth.type';
import type { ReturnWithErrPromise } from '~type/common.type';

import { join } from '~helper/path.helper';
import { apiClient } from '~api/api-client';
import { HttpException, errorHandler, isHttpException } from '~helper/error-handler';

class AuthService {
    private readonly endpoint = 'auth';

    async checkIsEmailExist(email: string) {
        const response = await apiClient.post(join(this.endpoint, 'is-email-exist'), { email });
        if (isHttpException(response.data)) throw new HttpException(response.data);
    }

    async verifyEmail(email: string) {
        const response = await apiClient.post(join(this.endpoint, 'verify-email'), { email });
        if (isHttpException(response.data)) throw new HttpException(response.data);
    }

    async signIn(data: SignInDto): Promise<Token> {
        const response = await apiClient.post<Token>(join(this.endpoint, 'sign-in'), data);
        if (isHttpException(response.data)) throw new HttpException(response.data);
        return response.data;
    }

    async signUp(data: SignUpDto): Promise<Token> {
        const response = await apiClient.post<Token>(join(this.endpoint, 'sign-up'), data);
        if (isHttpException(response.data)) throw new HttpException(response.data);
        return response.data;
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
