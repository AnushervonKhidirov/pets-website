import { join } from '~helper/path.helper';
import { apiClient } from '~api/api-client';
import { HttpException, isHttpException } from '~helper/error-handler';

class ResetPasswordService {
    private readonly endpoint = 'reset-password';

    async sendUrl({ email }: { email: string }) {
        const response = await apiClient.post(join(this.endpoint, 'send-url'), {
            email,
        });

        if (isHttpException(response.data)) throw new HttpException(response.data);
    }

    async checkUrl(pageId: string) {
        const response = await apiClient.post(join(this.endpoint, 'check-url'), {
            pageId,
        });

        if (isHttpException(response.data)) throw new HttpException(response.data);
    }

    async reset(resetData: { pageId: string; password: string }) {
        const response = await apiClient.post(join(this.endpoint, 'reset'), {
            resetData,
        });

        if (isHttpException(response.data)) throw new HttpException(response.data);
    }
}

export default new ResetPasswordService();
