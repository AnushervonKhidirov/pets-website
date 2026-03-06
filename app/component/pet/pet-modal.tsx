import type { FC } from 'react';
import type { UploadProps } from 'antd';
import type { Breed, PetDto, Pet, PetType } from '~type/pet.type';

import { useState } from 'react';
import petService from '~service/pet.service';

import { Modal, Form, Input, Select, DatePicker, Upload, Button, notification } from 'antd';
import ImgCrop from 'antd-img-crop';

import { Sex } from '~type/pet.type';
import { sex } from '~constant/pet';
import { alertError } from '~helper/alert-error';
import { reduceSize } from '~helper/image.helper';

type PetModalProps = {
    open: boolean;
    setOpen: (state: boolean) => void;
    pet?: Pet | null;
    onSuccess?: (pet: Pet) => void;
};

type SubmitData = PetDto & { image?: File };

const PetModal: FC<PetModalProps> = ({ pet, open, setOpen, onSuccess }) => {
    const [form] = Form.useForm();
    const [api, context] = notification.useNotification();

    const defaultFileList: UploadProps['fileList'] = pet?.image
        ? [
              {
                  uid: '-1',
                  name: 'placeholder',
                  status: 'done',
                  url: pet.image,
              },
          ]
        : undefined;

    const [loading, setLoading] = useState(false);

    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [breedsFiltered, setBreedsFiltered] = useState<Breed[]>([]);

    const sexOptions = (Object.keys(sex) as Sex[]).map(key => ({
        value: key,
        label: sex[key].ru,
    }));

    async function submit(data: SubmitData) {
        setLoading(true);

        if (pet) {
            await update(pet.id, data);
        } else {
            await create(data);
        }

        setLoading(false);
    }

    async function update(petId: number, { image, ...data }: SubmitData) {
        const [pet, err] = await petService.update(petId, data);

        if (err) {
            api.error(alertError(err));
        } else {
            const petData = { ...pet };

            if (image) {
                const [petImage, err] = await petService.setImage(image, pet.id);

                if (err) {
                    api.error(alertError(err));
                } else {
                    petData.image = petImage.image;
                }
            } else if (image === null) {
                const [, err] = await petService.deleteImage(pet.id);
                if (err) api.error(alertError(err));
                petData.image = null;
            }

            form.resetFields();
            if (onSuccess) onSuccess(petData);
            setTimeout(() => setOpen(false), 500);
        }
    }

    async function create({ image, ...data }: SubmitData) {
        const [pet, err] = await petService.create(data);

        if (err) {
            api.error(alertError(err));
        } else {
            const petData = { ...pet };

            if (image) {
                const [petImage, err] = await petService.setImage(image, pet.id);

                if (err) {
                    api.error(alertError(err));
                } else {
                    petData.image = petImage.image;
                }
            }

            form.resetFields();
            if (onSuccess) onSuccess(petData);
            setTimeout(() => setOpen(false), 500);
        }
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
            const filteredBreeds = pet
                ? breeds.filter(breed => breed.petTypeId === pet.petTypeId)
                : breeds;

            setBreeds(breeds);
            setBreedsFiltered(filteredBreeds);
        }
    }

    function openChangeHandler(open: boolean) {
        if (open) {
            if (petTypes.length === 0) fetchPtyTypes();
            if (breeds.length === 0) fetchBreeds();
        }
    }

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
                <Form form={form} onFinish={submit} preserve>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Введите кличку питомца' }]}
                        initialValue={pet?.name ?? null}
                    >
                        <Input placeholder="Кличка" />
                    </Form.Item>

                    <Form.Item
                        name="petTypeId"
                        rules={[{ required: true, message: 'Выберите вид питомца' }]}
                        initialValue={pet?.petTypeId ?? null}
                    >
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

                    <Form.Item name="about" initialValue={pet?.about ?? null}>
                        <Input.TextArea
                            placeholder="Описание"
                            autoSize={{ minRows: 2, maxRows: 3 }}
                        />
                    </Form.Item>

                    <Form.Item name="image" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <ImgCrop
                            aspect={1 / 0.55}
                            quality={1}
                            modalTitle="Обрезка изображения"
                            showGrid
                            modalOk="Обрезать"
                            modalCancel="Закрыть"
                            modalProps={{ centered: true }}
                        >
                            <Upload
                                beforeUpload={async file => {
                                    return (await reduceSize(file)) as File;
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
                                defaultFileList={defaultFileList}
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
