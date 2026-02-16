import type { FC } from 'react';

import petService from '~service/pet.service';
import useMyPetsStore from '~store/my-pets.store';
import { useEffectOnce } from '~hook/use-effect-once';

import { Empty, Button, Typography, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Container, Grid, PetCard } from '~component/common';
import { alertError } from '~helper/alert-error';

import empty from 'src/images/empty.png';
import classes from './my-pets.module.css';

const { Title } = Typography;

const MyPets: FC = () => {
    const { pets, setPets } = useMyPetsStore(state => state);

    const [api, context] = notification.useNotification();

    async function fetchMyPets() {
        const [myPets, err] = await petService.getMy();

        if (err) {
            api.error(alertError(err));
        } else {
            setPets(myPets);
        }
    }

    useEffectOnce(() => {
        fetchMyPets();
    });

    return (
        <Container section>
            <div className={classes.header}>
                <Title level={3}>
                    <span className={classes.headline}>Ваши питомцы</span>
                </Title>

                <Button color="cyan" variant="solid">
                    <PlusOutlined style={{ fontSize: '1.25em' }} />
                </Button>
            </div>

            {Array.isArray(pets) && pets.length > 0 ? (
                <Grid>
                    {pets.map(pet => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </Grid>
            ) : (
                <Empty
                    image={empty}
                    styles={{ image: { height: '15rem' } }}
                    description="У вас пока нет питомцев!"
                >
                    <Button color="cyan" variant="solid">
                        Добавить питомца
                    </Button>
                </Empty>
            )}
            {context}
        </Container>
    );
};

export default MyPets;
