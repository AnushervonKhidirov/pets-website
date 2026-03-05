import type { ReturnWithErrPromise } from '~type/common.type';
import type { UpdateUserDto, User } from '~type/user.type';

import { join } from '~helper/path.helper';
import { apiClient, apiClientAuth } from '~api/api-client';
import { errorHandler, HttpException, isHttpException } from '~helper/error-handler';

class UserService {
    private readonly endpoint = 'user';

    async getMe(): ReturnWithErrPromise<User> {
        try {
            const response = await apiClientAuth.get<User>(join(this.endpoint, 'me'));
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getOne(id: number): ReturnWithErrPromise<User> {
        try {
            const response = await apiClient.get<User>(join(this.endpoint, id));
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getAll(): ReturnWithErrPromise<User[]> {
        try {
            const response = await apiClient.get<User[]>(this.endpoint);
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async update(data: UpdateUserDto): ReturnWithErrPromise<User> {
        try {
            const response = await apiClientAuth.patch<User>(this.endpoint, data);
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export default new UserService();
