import type { FC } from 'react';
import type { Breed, CratePetDto, Pet, PetType } from '~type/pet.type';

import { useState } from 'react';
import { useEffectOnce } from '~hook/use-effect-once';
import petService from '~service/pet.service';
import useMyPetsStore from '~store/my-pets.store';

import { Modal, Form, Input, Select, DatePicker, Upload, Button, notification } from 'antd';
import ImgCrop from 'antd-img-crop';

import { Sex } from '~type/pet.type';
import { sex } from '~constant/pet';
import { alertError } from '~helper/alert-error';
import { reduceSize } from '~helper/image.helper';

type PetModalProps = {
    pet: Pet | null;
    setPet: (pet: Pet | null) => void;
    open: boolean;
    setOpen: (state: boolean) => void;
};

const PetModal: FC<PetModalProps> = ({ pet, setPet, open, setOpen }) => {
    const [form] = Form.useForm();
    const [api, context] = notification.useNotification();
    const { addPet } = useMyPetsStore(state => state);

    const [loading, setLoading] = useState(false);

    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [breedsFiltered, setBreedsFiltered] = useState<Breed[]>([]);

    const sexOptions = (Object.keys(sex) as Sex[]).map(key => ({
        value: key,
        label: sex[key].ru,
    }));

    function openChangeHandler(open: boolean) {
        if (!open && pet) setPet(null);
    }

    async function submit({ image, ...data }: CratePetDto & { image?: File }) {
        setLoading(true);

        const [pet, err] = await petService.create(data);

        if (err) {
            api.error(alertError(err));
        } else {
            const newPetData = { ...pet };

            if (image) {
                const [petImage, err] = await petService.setImage(image, pet.id);

                if (err) {
                    api.error(alertError(err));
                } else {
                    newPetData.image = petImage.image;
                }
            }

            addPet(newPetData);
        }

        setLoading(false);
    }

    async function fetchPtyTypes() {
        const [petTypes, err] = await petService.getPetType();

        if (err) {
            api.error(alertError(err));
        } else {
            setPetTypes(petTypes);
        }
    }

    async function fetchBreeds(petTypeId?: number) {
        const [breeds, err] = await petService.getBreed({ petTypeId });

        if (err) {
            api.error(alertError(err));
        } else {
            setBreeds(breeds);
        }
    }

    useEffectOnce(() => {
        fetchPtyTypes();
        fetchBreeds();
    });

    return (
        <>
            <Modal
                title={pet ? 'Редактирование питомца' : 'Создать питомца'}
                open={open}
                onCancel={() => setOpen(false)}
                centered
                footer={null}
                destroyOnHidden
                afterOpenChange={openChangeHandler}
            >
                <Form onFinish={submit} form={form} preserve>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Введите кличку питомца' }]}
                        initialValue={pet?.name ?? null}
                    >
                        <Input placeholder="Кличка" />
                    </Form.Item>

                    <Form.Item name="petTypeId" initialValue={pet?.petTypeId ?? null}>
                        <Select
                            placeholder="Вид"
                            options={petTypes.map(({ id, ru }) => ({ value: id, label: ru }))}
                            allowClear
                            onChange={id => {
                                form.setFieldValue('breedId', null);

                                const filteredBreeds = id
                                    ? breeds.filter(breed => breed.petTypeId === id)
                                    : breeds;

                                setBreedsFiltered(filteredBreeds);
                            }}
                        />
                    </Form.Item>

                    <Form.Item name="breedId" initialValue={pet?.breedId ?? null}>
                        <Select
                            placeholder="Порода"
                            options={breedsFiltered.map(({ id, ru }) => ({ value: id, label: ru }))}
                            allowClear
                            showSearch={{
                                filterOption: (inputValue, option) =>
                                    option?.label
                                        .toUpperCase()
                                        .indexOf(inputValue.toUpperCase()) !== -1,
                            }}
                        />
                    </Form.Item>

                    <Form.Item name="sex" initialValue={pet?.sex ?? null}>
                        <Select placeholder="Пол" options={sexOptions} allowClear />
                    </Form.Item>

                    <Form.Item name="birthday" initialValue={pet?.birthday ?? null}>
                        <DatePicker
                            format={{ format: 'DD/MM/YYYY' }}
                            placeholder="День рождение (день/месяц/год)"
                            allowClear
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item name="microchipId" initialValue={pet?.microchipId ?? null}>
                        <Input placeholder="Номер чипа" />
                    </Form.Item>

                    <Form.Item name="image" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <ImgCrop
                            aspect={1 / 0.55}
                            quality={0.7}
                            modalTitle="Обрезка изображения"
                            showGrid
                            modalOk="Обрезать"
                            modalCancel="Закрыть"
                            modalProps={{ centered: true }}
                        >
                            <Upload
                                beforeUpload={async file => {
                                    await reduceSize(file);
                                }}
                                customRequest={({ file, onSuccess }) => {
                                    form.setFieldValue('image', file);
                                    onSuccess!('ok');
                                }}
                                onRemove={() => {
                                    form.setFieldValue('image', null);
                                }}
                                name="image"
                                listType="picture-card"
                                maxCount={1}
                                accept="image/png, image/jpeg, image/jpg"
                                // fileList={[
                                //     {
                                //         uid: '-1',
                                //         name: 'image.png',
                                //         status: 'done',
                                //         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                                //     },
                                // ]}
                            >
                                Загрузить фотографию
                            </Upload>
                        </ImgCrop>
                    </Form.Item>

                    <Button
                        block
                        color="cyan"
                        variant="solid"
                        onClick={() => form.submit()}
                        loading={loading}
                    >
                        Сохранить
                    </Button>
                </Form>
            </Modal>
            {context}
        </>
    );
};

export default PetModal;
