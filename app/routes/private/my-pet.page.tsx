import type { FC } from 'react';
import type { Route } from './+types/my-pet.page';

import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { notification } from 'antd';
import { Container, Loader } from '~component/common';
import PetInfoCard from '~component/pet/pet-info-card';

import { alertError } from '~helper/alert-error';

export function meta() {
    return [{ title: 'Pet' }];
}

const MyPet: FC = () => {
    const params = useParams<Route.LoaderArgs['params']>();
    const [api, context] = notification.useNotification();

    const { isPending, data: pet } = useQuery({
        queryKey: ['my-pets'],
        queryFn: fetchMyPet,
    });

    async function fetchMyPet() {
        if (!params.petId) return;
        const [pet, err] = await petService.getOne(Number.parseInt(params.petId));

        if (err) {
            api.error(alertError(err));
            throw err;
        }

        return pet;
    }

    if (isPending) return <Loader />;

    return (
        pet && (
            <Container section maxWidth={1000} style={{ minHeight: '100%' }}>
                <PetInfoCard pet={pet} showQR showLostBtn />
                {context}
            </Container>
        )
    );
};

export default MyPet;
