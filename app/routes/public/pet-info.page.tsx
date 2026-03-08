import type { FC } from 'react';
import type { Route } from './+types/pet-info.page';

import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { Container, Loader, ErrorInfo } from '~component/common';
import PetInfoCard from '~component/pet/pet-info-card';

export function meta() {
    return [{ title: 'О питомце' }];
}

const PetInfo: FC = () => {
    const petId = Number.parseInt(useParams<Route.LoaderArgs['params']>().petId!);

    const {
        isPending,
        isError,
        isSuccess,
        error,
        data: pet,
    } = useQuery({
        queryKey: ['pet', petId],
        queryFn: petService.getOne.bind(petService, petId),
    });

    if (isPending) return <Loader />;
    if (isError) return <ErrorInfo error={error} />;

    return (
        isSuccess && (
            <Container section maxWidth={1000} style={{ minHeight: '100%' }}>
                <PetInfoCard pet={pet} showOwner />
            </Container>
        )
    );
};

export default PetInfo;
