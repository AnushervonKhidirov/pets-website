import type { FC } from 'react';
import type { Route } from './+types/pet-info.page';

import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { notification } from 'antd';
import petService from '~service/pet.service';

import { Container, Loader, ErrorInfo } from '~component/common';
import PetInfoCard from '~component/pet/pet-info-card';
import { alertError } from '~helper/alert-error';

export function meta() {
    return [{ title: 'О питомце' }];
}

const PetInfo: FC = () => {
    const params = useParams<Route.LoaderArgs['params']>();
    const [api, context] = notification.useNotification();

    const {
        isPending,
        isError,
        isSuccess,
        error,
        data: pet,
    } = useQuery({
        queryKey: ['pet'],
        queryFn: fetchMyPet,
    });

    async function fetchMyPet() {
        if (!params.petId) throw new Error('pet ID not found');
        const [pet, err] = await petService.getOne(Number.parseInt(params.petId));

        if (err) {
            if (err.statusCode !== 404) api.error(alertError(err));
            throw err;
        }

        return pet;
    }

    if (isPending) return <Loader />;
    if (isError) return <ErrorInfo error={error} />;

    return (
        isSuccess && (
            <Container section maxWidth={1000} style={{ minHeight: '100%' }}>
                <PetInfoCard pet={pet} showOwner />
                {context}
            </Container>
        )
    );
};

export default PetInfo;
