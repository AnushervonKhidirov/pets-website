import type { FC } from 'react';
import type { Pet } from '~type/pet.type';
import type { MenuProps } from 'antd';

import { useState } from 'react';
import { useEffectOnce } from '~hook/use-effect-once';
import petService from '~service/pet.service';
import useMyPetsStore from '~store/my-pets.store';

import { Empty, Typography, Modal, notification, Button } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';
import { Container, Grid, QRCode } from '~component/common';
import { alertError } from '~helper/alert-error';
import PetInfoCard from '~component/pet/pet-info-card';
import {
    CratePetButton,
    LostPetButton,
    EditPetButton,
    DeletePetButton,
} from '~component/pet/pet-action-buttons';

import { Route } from '~constant/route';
import empty from 'src/images/empty-pet-image.png';
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
        <Container section style={{ minHeight: '100%' }}>
            <div className={classes.header}>
                <Title level={3}>
                    <span className={classes.headline}>Ваши питомцы</span>
                </Title>

                <CratePetButton />
            </div>

            {Array.isArray(pets) && pets.length > 0 ? (
                <Grid size="large">
                    {pets.map(pet => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </Grid>
            ) : (
                <Empty
                    image={empty}
                    styles={{ image: { height: '10rem', marginTop: '5rem', marginBottom: '1rem' } }}
                    description={<span>У вас пока нет питомцев.</span>}
                />
            )}

            {context}
        </Container>
    );
};

const PetCard: FC<{ pet: Pet }> = ({ pet }) => {
    const [qrOpened, setQrOpened] = useState(false);

    const actions: MenuProps['items'] = [
        {
            key: 'QR',
            label: (
                <Button
                    icon={<QrcodeOutlined />}
                    onClick={() => setQrOpened(true)}
                    variant="text"
                    color="cyan"
                    style={{ justifyContent: 'start' }}
                >
                    Показать QR код
                </Button>
            ),
        },
        {
            key: 'Редактировать',
            label: (
                <EditPetButton pet={pet} variant="text" block style={{ justifyContent: 'start' }} />
            ),
        },
        {
            key: 'Удалить',
            label: (
                <DeletePetButton
                    pet={pet}
                    type="primary"
                    block
                    style={{ justifyContent: 'start' }}
                />
            ),
        },
    ];

    return (
        <>
            <PetInfoCard pet={pet} actions={actions}>
                <LostPetButton pet={pet} size="large" />
            </PetInfoCard>

            <Modal
                title={'QR Код'}
                centered
                footer={null}
                width="auto"
                styles={{ container: { backgroundColor: '#fff' } }}
                open={qrOpened}
                onCancel={() => setQrOpened(false)}
            >
                <QRCode
                    name={pet.name}
                    value={`${globalThis.location.origin}${Route.PetInfo}/${pet.id}`}
                />
            </Modal>
        </>
    );
};

export default MyPets;
