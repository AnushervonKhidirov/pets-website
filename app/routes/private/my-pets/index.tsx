import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import useMyPetsStore from '~store/my-pets.store';
import petService from '~service/pet.service';

import { Link } from 'react-router';
import { Empty, Typography, notification } from 'antd';
import { Container, Grid, Loader } from '~component/common';
import { alertError } from '~helper/alert-error';
import PetInfoCard from '~component/pet/pet-info-card';
import { CratePetButton } from '~component/pet/pet-action-buttons';

import { Route } from '~constant/route';
import empty from 'src/images/empty-pet-image.png';
import classes from './my-pets.module.css';

export function meta() {
    return [{ title: 'My pets' }];
}

const { Title } = Typography;

const MyPets: FC = () => {
    // TODO: remove My Pets Store
    const { pets, setPets } = useMyPetsStore(state => state);

    const { isPending } = useQuery({
        queryKey: ['my-pets'],
        queryFn: fetchMyPets,
    });

    const [api, context] = notification.useNotification();

    async function fetchMyPets() {
        const [myPets, err] = await petService.getMy();

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

                <CratePetButton />
            </div>

            {pets.length > 0 ? (
                <Grid size="large">
                    {pets.map(pet => (
                        <Link key={pet.id} to={`${Route.PetInfo}/${pet.id}`} target="_blank">
                            <PetInfoCard pet={pet} hoverable hideBody />
                        </Link>
                    ))}
                </Grid>
            ) : (
                <Empty
                    image={empty}
                    styles={{
                        image: { height: '10rem', marginTop: '5rem', marginBottom: '1rem' },
                    }}
                    description={<span>У вас пока нет питомцев.</span>}
                />
            )}

            {context}
        </Container>
    );
};

export default MyPets;
