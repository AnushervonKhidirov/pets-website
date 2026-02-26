import type { FC } from 'react';
import type { Route as TRoute } from './+types/my-pet.page';
import type { MenuProps } from 'antd';
import type { Pet } from '~type/pet.type';

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { notification } from 'antd';
import { Container, Loader } from '~component/common';
import PetInfoCard from '~component/pet/pet-info-card';
import { DeletePetButton, EditPetButton, LostPetButton } from '~component/pet/pet-action-buttons';

import { alertError } from '~helper/alert-error';
import { Route } from '~constant/route';

export function meta() {
    return [{ title: 'Pet' }];
}

const MyPet: FC = () => {
    const params = useParams<TRoute.LoaderArgs['params']>();
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

const PetCard: FC<{ pet: Pet }> = ({ pet }) => {
    const navigation = useNavigate();
    const [currPet, setCurrPet] = useState(pet);

    function deletePetHandler() {
        navigation(Route.MyPets);
    }

    const actions: MenuProps['items'] = [
        {
            key: 'edit',
            label: (
                <EditPetButton
                    block
                    pet={pet}
                    color="default"
                    variant="text"
                    style={{ justifyContent: 'start' }}
                    onSuccess={setCurrPet}
                />
            ),
        },
        {
            key: 'delete',
            label: (
                <DeletePetButton
                    block
                    pet={pet}
                    type="primary"
                    style={{ justifyContent: 'start' }}
                    onSuccess={deletePetHandler}
                />
            ),
        },
    ];

    return (
        <PetInfoCard pet={currPet} showQR actions={actions}>
            <LostPetButton pet={currPet} block size="large" onSuccess={setCurrPet} />
        </PetInfoCard>
    );
};

export default MyPet;
