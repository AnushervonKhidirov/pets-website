import type { FC } from 'react';
import type { Route } from './+types/pet-info.page';
import type { PetWithUser } from '~type/pet.type';

import { useState } from 'react';
import { useParams } from 'react-router';
import { useEffectOnce } from '~hook/use-effect-once';
import petService from '~service/pet.service';

import { Container } from '~component/common';
import PetInfoCard from '~component/pet/pet-info-card';

export function meta() {
    return [{ title: 'Pet' }];
}

const PetInfo: FC = () => {
    const params = useParams<Route.LoaderArgs['params']>();

    const [pet, setPet] = useState<PetWithUser | null>(null);
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

    return (
        pet && (
            <Container section maxWidth={1000} style={{ minHeight: '100%' }}>
                <PetInfoCard pet={pet} showOwner />
            </Container>
        )
    );
};

const ErrorPage = () => {
    return <Container section>Пошел нахуй!</Container>;
};

export default PetInfo;
