import type { FC } from 'react';
import type { Route as TRoute } from './+types/my-pet.page';
import type { MenuProps } from 'antd';
import type { Pet } from '~type/pet.type';

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { Container, Loader, ErrorInfo } from '~component/common';
import PetInfoCard from '~component/pet/pet-info-card';
import { DeletePetButton, EditPetButton, LostPetButton } from '~component/pet/pet-action-buttons';

import { Route } from '~constant/route';

export function meta() {
    return [{ title: 'Мой питомец' }];
}

const MyPet: FC = () => {
    const params = Number.parseInt(useParams<TRoute.LoaderArgs['params']>().petId!);

    const {
        isPending,
        isError,
        isSuccess,
        error,
        data: pet,
    } = useQuery({
        queryKey: ['pet'],
        queryFn: petService.getOne.bind(petService, params),
    });

    if (isPending) return <Loader />;
    if (isError) return <ErrorInfo error={error} />;

    return (
        isSuccess && (
            <Container section maxWidth={1000} style={{ minHeight: '100%' }}>
                <PetCard pet={pet} />
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
