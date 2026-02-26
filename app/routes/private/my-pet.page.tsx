import type { FC } from 'react';
import type { Route } from './+types/my-pet.page';
import type { MenuProps } from 'antd';
import type { PetWithUser } from '~type/pet.type';

import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { notification } from 'antd';
import { Container, Loader } from '~component/common';
import PetInfoCard from '~component/pet/pet-info-card';

import { alertError } from '~helper/alert-error';
import { DeletePetButton, EditPetButton } from '~component/pet/pet-action-buttons';

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
                <PetCard pet={pet} />

                {context}
            </Container>
        )
    );
};

const PetCard: FC<{ pet: PetWithUser }> = ({ pet }) => {
    const actions: MenuProps['items'] = [
        {
            key: 'edit',
            label: (
                <EditPetButton
                    pet={pet}
                    color="default"
                    variant="text"
                    block
                    style={{ justifyContent: 'start' }}
                />
            ),
        },
        {
            key: 'delete',
            label: (
                <DeletePetButton
                    pet={pet}
                    type="primary"
                    block
                    style={{ justifyContent: 'start' }}
                />
            ),
        },
    ];

    return <PetInfoCard pet={pet} showQR showLostBtn actions={actions}></PetInfoCard>;
};

export default MyPet;
