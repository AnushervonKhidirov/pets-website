import type { VetClinic } from '~type/vet-clinic.type';

import { join } from '~helper/path.helper';
import { apiClient } from '~api/api-client';
import { HttpException, isHttpException } from '~helper/error-handler';

class VetClinicService {
    private readonly endpoint = 'vet-clinic';

    async getOne(id: number): Promise<VetClinic> {
        const response = await apiClient.get<VetClinic>(join(this.endpoint, id));
        if (isHttpException(response.data)) throw new HttpException(response.data);
        return response.data;
    }

    async getAll(): Promise<VetClinic[]> {
        const response = await apiClient.get<VetClinic[]>(this.endpoint);
        if (isHttpException(response.data)) throw new HttpException(response.data);
        return response.data;
    }
}

export default new VetClinicService();
