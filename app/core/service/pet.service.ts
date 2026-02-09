import type { ReturnWithErrPromise } from '~type/common.type';

import { errorHandler } from '~helper/error-handler';

class PetService {
    async getMy(): ReturnWithErrPromise {
        try {
            return [null, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getOne(id: number): ReturnWithErrPromise {
        try {
            return [null, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getAll(): ReturnWithErrPromise {
        try {
            return [null, null];
        } catch (err) {
            return errorHandler(err);
        }
    }
}

export default new PetService();
