import type { ReturnWithErrPromise } from '~type/common.type';
import type { User, UserFromResponse } from '~type/user.type';

import { apiClient, apiClientAuth } from '~api/apiClient';
import { errorHandler, isHttpException } from '~helper/error-handler';

class UserService {
    async getMe(): ReturnWithErrPromise<User> {
        try {
            const response = await apiClientAuth.get<UserFromResponse>('/user/me');
            if (isHttpException(response.data)) throw response.data;
            const user = this.parseContacts(response.data);
            return [user, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getOne(id: number): ReturnWithErrPromise<User> {
        try {
            const response = await apiClient.get<UserFromResponse>(`/user/${id}`);
            if (isHttpException(response.data)) throw response.data;
            const user = this.parseContacts(response.data);
            return [user, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getAll(): ReturnWithErrPromise<User[]> {
        try {
            const response = await apiClient.get<UserFromResponse[]>(`/user`);
            if (isHttpException(response.data)) throw response.data;
            const users = response.data.map(user => this.parseContacts(user));
            return [users, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    private parseContacts(user: UserFromResponse): User {
        if (!user.contacts) return { ...user, contacts: [] };
        const contacts = JSON.parse(user.contacts) as User['contacts'];
        return { ...user, contacts };
    }
}

export default new UserService();
