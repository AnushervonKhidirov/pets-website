import type { ReturnWithErrPromise, MessageDataDto } from '~type/common.type';

import { apiClient } from '~api/api-client';
import { errorHandler, HttpException, isHttpException } from '~helper/error-handler';

class MessageService {
    private readonly endpoint = 'message';

    async send(data: MessageDataDto): ReturnWithErrPromise {
        try {
            const response = await apiClient.post(this.endpoint, data);
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [null, null];
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export default new MessageService();
