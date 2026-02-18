import type { FC } from 'react';
import type { Route } from './+types/pet-info.page';
import type { Pet } from '~type/pet.type';

import { useState } from 'react';
import { useParams } from 'react-router';
import { useEffectOnce } from '~hook/use-effect-once';
import petService from '~service/pet.service';

import { Container } from '~component/common';
import PetInfoSection from '~pageComponent/pet/section/pet-info';

const PetInfo: FC = () => {
    const params = useParams<Route.LoaderArgs['params']>();

    const [pet, setPet] = useState<Pet | null>(null);
    const [isError, setIsError] = useState(false);

    async function fetchPet(petId: number) {
        const [pet, err] = await petService.getOne(petId);
        if (err) {
            setIsError(true);
        } else {
            setPet(pet);
        }
    }

    useEffectOnce(() => {
        if (params.petId) {
            const petId = Number.parseInt(params.petId);
            if (!Number.isNaN(petId)) fetchPet(petId);
        }
    });

    if (isError) return <ErrorPage />;
    return pet && <PetInfoSection pet={pet} />;
};

const ErrorPage = () => {
    return <Container section>Пошел нахуй!</Container>;
};

export default PetInfo;
