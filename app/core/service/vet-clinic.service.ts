import type { ReturnWithErrPromise } from '~type/common.type';
import type { VetClinic } from '~type/vet-clinic.type';

import { join } from '~helper/path.helper';
import { apiClient } from '~api/api-client';
import { errorHandler, HttpException, isHttpException } from '~helper/error-handler';

class VetClinicService {
    private readonly endpoint = 'vet-clinic';

    async getOne(id: number): ReturnWithErrPromise<VetClinic> {
        try {
            const response = await apiClient.get<VetClinic>(join(this.endpoint + id));
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getAll(): ReturnWithErrPromise<VetClinic[]> {
        try {
            const response = await apiClient.get<VetClinic[]>(this.endpoint);
            if (isHttpException(response.data)) throw new HttpException(response.data);
            return [response.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export default new VetClinicService();
