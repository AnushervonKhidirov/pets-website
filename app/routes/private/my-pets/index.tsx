import type { FC } from 'react';
import type { Pet } from '~type/pet.type';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { Link } from 'react-router';
import { Empty, Typography, Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Container, Grid, Loader } from '~component/common';
import { alertError } from '~helper/alert-error';
import PetInfoCard from '~component/pet/pet-info-card';
import PetModal from '~component/pet/pet-modal';

import { Route } from '~constant/route';
import funnyCat from 'src/images/funny-cat.png';
import classes from './my-pets.module.css';

export function meta() {
    return [{ title: 'Мои питомцы' }];
}

const { Title } = Typography;

const MyPets: FC = () => {
    const [pets, setPets] = useState<Pet[]>([]);

    const { isPending } = useQuery({
        queryKey: ['my-pets'],
        queryFn: fetchMyPets,
    });

    const [api, context] = notification.useNotification();

    async function fetchMyPets() {
        const [myPets, err] = await petService.getMyMany();

        if (err) {
            api.error(alertError(err));
            throw err;
        }

        setPets(myPets);
        return myPets;
    }

    if (isPending) return <Loader />;

    return (
        <Container section style={{ minHeight: '100%' }}>
            <div className={classes.header}>
                <Title level={3}>
                    <span className={classes.headline}>Ваши питомцы</span>
                </Title>

                <AddPetButton onSuccess={pet => setPets(pets => [...pets, pet])} />
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
                <Empty
                    image={funnyCat}
                    description={<span>У вас пока нет питомцев.</span>}
                    styles={{
                        image: { height: '10rem', marginTop: '5rem', marginBottom: '1rem' },
                    }}
                />
            )}

            {context}
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
