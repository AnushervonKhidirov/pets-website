import type { FC } from 'react';
import type { Dayjs } from 'dayjs';
import type { DescriptionsProps } from 'antd';
import type { Pet } from '~type/pet.type';

import { Tag, Descriptions, Typography, Divider } from 'antd';
import { PawIcon, TickIcon } from '~icons';
import { Card, Background } from '~component/common';

import dayjs from 'dayjs';
import { cyan, light } from '~/config/ant.config';
import classes from './pet-card.module.css';
import classNames from 'classnames';

const { Title, Text } = Typography;

const PetCard: FC<{ pet: Pet }> = ({ pet }) => {
    const items: DescriptionsProps['items'] = [
        {
            key: 'Вид питомца',
            label: 'Вид питомца',
            children: pet.petType.ru,
        },
        {
            key: 'Пол',
            label: 'Пол',
            children: pet.sex ?? '—',
        },
        {
            key: 'Возраст',
            label: 'Возраст',
            children: getAge(pet.birthday),
        },
        {
            key: 'Чип',
            label: 'Чип',
            children: pet.microchipId ?? '—',
        },
    ];

    return (
        <Card color={light} cover={<CardImage name={pet.name} image={pet.image} lost={pet.lost} />}>
            <div style={{ marginBottom: '0.5em' }}>
                <Title level={3}>{pet.name}</Title>
                <Text type="secondary">{pet.breed?.ru}</Text>
            </div>

            <Divider />

            <Descriptions items={items} column={1} />
        </Card>
    );
};

const CardImage: FC<Pick<Pet, 'name' | 'image' | 'lost'>> = ({ name, image, lost }) => {
    return (
        <Background
            color={cyan[0]}
            style={{ aspectRatio: '1/0.5', display: 'grid', justifyContent: 'center' }}
        >
            {image ? (
                <img src={image} alt={name} className={classes.image} />
            ) : (
                <PawIcon style={{ fontSize: '5rem', color: cyan[5] }} />
            )}
            <StatusTag lost={lost} />
        </Background>
    );
};

const StatusTag: FC<{ lost: boolean }> = ({ lost }) => {
    return lost ? (
        <Tag
            color="error"
            variant="solid"
            className={classNames(classes.tag, { [classes.lost]: lost })}
        >
            Разыскивается
        </Tag>
    ) : (
        <Tag color="success" variant="outlined" icon={<TickIcon />} className={classes.tag}>
            Дома
        </Tag>
    );
};

function getAge(date?: Dayjs | null): string | number {
    if (!date?.isValid()) return '—';

    const currentYear = dayjs().get('year');
    const birthYear = date.get('year');

    return currentYear - birthYear;
}

export default PetCard;
