import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { Link } from 'react-router';
import { Typography, Button } from 'antd';
import { Container, Grid, Loader, Empty, ErrorInfo } from '~component/common';
import PetInfoCard from '~component/pet/pet-info-card';

import { Route } from '~constant/route';
import { join } from '~helper/path.helper';

export function meta() {
    return [{ title: 'Мои питомцы' }];
}

const { Title } = Typography;

const MyPets: FC = () => {
    const {
        isPending,
        isError,
        error,
        data: pets,
    } = useQuery({
        queryKey: ['my_pets'],
        queryFn: petService.getMyMany.bind(petService),
    });

    if (isPending) return <Loader />;
    if (isError) return <ErrorInfo error={error} />;

    return (
        <Container section style={{ minHeight: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <Title level={3} style={{ marginBottom: 0 }}>
                    Ваши питомцы
                </Title>

                <Link to={Route.CreatePet}>
                    <Button color="cyan" variant="solid">
                        Добавить
                    </Button>
                </Link>
            </div>

            {pets.length > 0 ? (
                <Grid size="large">
                    {pets.map(pet => (
                        <Link key={pet.id} to={join(Route.MyPet, pet.id)}>
                            <PetInfoCard pet={pet} hoverable hideBody />
                        </Link>
                    ))}
                </Grid>
            ) : (
                <Empty description="У вас пока нет питомцев" />
            )}
        </Container>
    );
};

export default MyPets;
