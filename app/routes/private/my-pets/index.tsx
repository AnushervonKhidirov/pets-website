import type { FC } from 'react';
import type { Pet } from '~type/pet.type';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { Link } from 'react-router';
import { Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Container, Grid, Loader, Empty, ErrorInfo } from '~component/common';
import PetInfoCard from '~component/pet/pet-info-card';
import PetModal from '~component/pet/pet-modal';

import { Route } from '~constant/route';
import classes from './my-pets.module.css';

export function meta() {
    return [{ title: 'Мои питомцы' }];
}

const { Title } = Typography;

const MyPets: FC = () => {
    const queryClient = useQueryClient();

    const {
        isPending,
        isError,
        error,
        data: pets,
    } = useQuery({
        queryKey: ['my_pets'],
        queryFn: petService.getMyMany.bind(petService),
    });

    function addPet(pet: Pet) {
        queryClient.setQueryData<Pet[]>(['my_pets'], (pets = []) => {
            return [...pets, pet];
        });
    }

    if (isPending) return <Loader />;
    if (isError) return <ErrorInfo error={error} />;

    return (
        <Container section style={{ minHeight: '100%' }}>
            <div className={classes.header}>
                <Title level={3}>
                    <span className={classes.headline}>Ваши питомцы</span>
                </Title>

                <AddPetButton onSuccess={addPet} />
            </div>

            {pets.length > 0 ? (
                <Grid size="large">
                    {pets.map(pet => (
                        <Link key={pet.id} to={`${Route.MyPet}/${pet.id}`} target="_blank">
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

export const AddPetButton: FC<{ onSuccess: (pet: Pet) => void }> = ({ onSuccess }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Button
                color="cyan"
                variant="solid"
                onClick={() => setModalOpen(true)}
                icon={<PlusOutlined />}
            >
                Добавить
            </Button>

            <PetModal open={modalOpen} setOpen={setModalOpen} onSuccess={onSuccess} />
        </>
    );
};

export default MyPets;
