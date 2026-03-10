import type { FC } from 'react';
import type { Route as TRoute } from './+types/my-pet.page';
import type { MenuProps } from 'antd';
import type { Pet } from '~type/pet.type';

import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { Button, Modal, notification } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Container, Loader, ErrorInfo } from '~component/common';
import PetInfoCard from '~component/pet/pet-info-card';
import LostInfoModal from '~component/pet/lost-pet-modal';

import { Route } from '~constant/route';
import { join } from '~helper/path.helper';

export function meta() {
    return [{ title: 'Мой питомец' }];
}

const deletePet = petService.delete.bind(petService);

const MyPet: FC = () => {
    const params = Number.parseInt(useParams<TRoute.LoaderArgs['params']>().petId!);

    const {
        isPending,
        isError,
        isSuccess,
        error,
        data: pet,
    } = useQuery({
        queryKey: ['pet'],
        queryFn: petService.getOne.bind(petService, params),
    });

    if (isPending) return <Loader />;
    if (isError) return <ErrorInfo error={error} />;

    return (
        isSuccess && (
            <Container section maxWidth={1000} style={{ minHeight: '100%' }}>
                <PetCard pet={pet} />
            </Container>
        )
    );
};

const PetCard: FC<{ pet: Pet }> = ({ pet }) => {
    const navigation = useNavigate();
    const [currPet, setCurrPet] = useState(pet);

    const [api, context] = notification.useNotification();

    const [open, setOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const actions: MenuProps['items'] = [
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: <Link to={join(Route.MyPetSetting, pet.id)}>Редактировать</Link>,
        },
        {
            key: 'delete',
            danger: true,
            icon: <DeleteOutlined />,
            onClick: () => setOpen(true),
            label: 'Удалить',
        },
    ];

    const { mutate, isPending } = useMutation({
        mutationKey: ['delete_pet'],
        mutationFn: deletePet,
        onSuccess: pet => {
            navigation(Route.MyPets);
        },
        onError: error => {
            api.error({ description: error.message });
        },
        onSettled: () => {
            setOpen(false);
        },
    });

    return (
        <PetInfoCard pet={currPet} showQR actions={actions}>
            <Button
                block
                size="large"
                danger={!pet.lostInfo}
                color="cyan"
                type="primary"
                variant="solid"
                onClick={() => setModalOpen(true)}
            >
                Объявление о пропаже
            </Button>

            <LostInfoModal
                pet={pet}
                lostInfo={pet.lostInfo}
                open={modalOpen}
                setOpen={setModalOpen}
                onSuccess={setCurrPet}
            />

            <Modal
                open={open}
                title="Удалить питомца?"
                okText="Удалить"
                okButtonProps={{ loading: isPending, type: 'primary', danger: true }}
                cancelText="Отмена"
                onOk={() => mutate(pet.id)}
                onCancel={() => setOpen(false)}
                mask={false}
                destroyOnHidden
            >
                Питомец <b>{pet.name}</b> будет удален
            </Modal>
            {context}
        </PetInfoCard>
    );
};

export default MyPet;
