import type { ChangePasswordDto, UpdateUserDto, User } from '~type/user.type';

import { join } from '~helper/path.helper';
import { apiClient, apiClientAuth } from '~api/api-client';
import { HttpException, isHttpException } from '~helper/error-handler';

class UserService {
    private readonly endpoint = 'user';

    async getMe(): Promise<User> {
        const response = await apiClientAuth.get<User>(join(this.endpoint, 'me'));
        if (isHttpException(response.data)) throw new HttpException(response.data);
        return response.data;
    }

    async getOne(id: number): Promise<User> {
        const response = await apiClient.get<User>(join(this.endpoint, id));
        if (isHttpException(response.data)) throw new HttpException(response.data);
        return response.data;
    }

    async getAll(): Promise<User[]> {
        const response = await apiClient.get<User[]>(this.endpoint);
        if (isHttpException(response.data)) throw new HttpException(response.data);
        return response.data;
    }

    async update(data: UpdateUserDto): Promise<User> {
        const response = await apiClientAuth.patch<User>(this.endpoint, data);
        if (isHttpException(response.data)) throw new HttpException(response.data);
        return response.data;
    }

    async changePassword(data: ChangePasswordDto) {
        const response = await apiClientAuth.patch<User>(
            join(this.endpoint, 'change-password'),
            data,
        );

        if (isHttpException(response.data)) throw new HttpException(response.data);
    }

    async getResetPasswordUrl({ email }: { email: string }) {
        const response = await apiClientAuth.post<User>(join(this.endpoint, 'reset-password-url'), {
            email,
        });

        if (isHttpException(response.data)) throw new HttpException(response.data);
    }

    async checkResetPasswordUrl(urlId: string) {
        const response = await apiClientAuth.post<User>(
            join(this.endpoint, 'check-reset-password-url'),
            { urlId },
        );

        if (isHttpException(response.data)) throw new HttpException(response.data);
    }

    async resetPassword(password: string) {
        const response = await apiClientAuth.post<User>(join(this.endpoint, 'reset-password'), {
            password,
        });

        if (isHttpException(response.data)) throw new HttpException(response.data);
    }
}

export default new UserService();
