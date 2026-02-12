import type { ReturnWithErrPromise } from '~type/common.type';
import type { UpdateUserDto, User } from '~type/user.type';

import { apiClient, apiClientAuth } from '~api/apiClient';
import { errorHandler, isHttpException } from '~helper/error-handler';

class UserService {
    async getMe(): ReturnWithErrPromise<User> {
        try {
            const response = await apiClientAuth.get<User>('/user/me');
            if (isHttpException(response.data)) throw response.data;
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getOne(id: number): ReturnWithErrPromise<User> {
        try {
            const response = await apiClient.get<User>(`/user/${id}`);
            if (isHttpException(response.data)) throw response.data;
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getAll(): ReturnWithErrPromise<User[]> {
        try {
            const response = await apiClient.get<User[]>(`/user`);
            if (isHttpException(response.data)) throw response.data;
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async update(data: UpdateUserDto): ReturnWithErrPromise<User> {
        try {
            const response = await apiClientAuth.patch<User>('/user', data);
            if (isHttpException(response.data)) throw response.data;
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export default new UserService();
