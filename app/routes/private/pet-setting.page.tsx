import type { Route as TRoute } from './+types/pet-setting.page';

import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { Typography } from 'antd';
import { Container, Loader, ErrorInfo } from '~component/common';

import PetForm from '~component/pet/pet-form';

export function meta() {
    return [{ title: 'Редактирование питомца' }];
}

const fetchPet = petService.getMyOne.bind(petService);

const { Title } = Typography;

const MyPetSettingPage = () => {
    const params = useParams<TRoute.LoaderArgs['params']>();
    const petId = Number.parseInt(params.petId ?? '0');

    const { isPending, isError, isSuccess, error, data } = useQuery({
        queryKey: ['fetch_my_pet', `fetch_my_pet_${petId}`],
        queryFn: fetchPet.bind(null, petId),
    });

    if (isPending) return <Loader />;
    if (isError) return <ErrorInfo error={error} />;

    return (
        isSuccess && (
            <Container section style={{ minHeight: '100%' }}>
                <Title level={3}>Редактирование питомца</Title>
                <PetForm pet={data} />
            </Container>
        )
    );
};

export default MyPetSettingPage;
