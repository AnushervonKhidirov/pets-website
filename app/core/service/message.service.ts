import type { MessageDataDto } from '~type/common.type';

import { apiClient } from '~api/api-client';
import { HttpException, isHttpException } from '~helper/error-handler';

class MessageService {
    private readonly endpoint = 'message';

    async send(data: MessageDataDto) {
        const response = await apiClient.post(this.endpoint, data);
        if (isHttpException(response.data)) throw new HttpException(response.data);
    }
}

export default new MessageService();
