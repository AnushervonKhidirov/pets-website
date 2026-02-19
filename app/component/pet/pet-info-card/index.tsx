import type { FC, JSX, ReactNode } from 'react';
import type { Pet, PetWithUser } from '~type/pet.type';
import type { Dayjs } from 'dayjs';

import { Tag, Typography } from 'antd';
import { cyan, gray, light } from '~/config/ant.config';
import {
    PawIcon,
    TickIcon,
    WarningIcon,
    GenderIcon,
    HashIcon,
    CalendarIcon,
    PhoneIcon,
} from '~icons';
import { Background, Card, UserAvatar, PhoneLink, Contacts } from '~component/common';

import dayjs from 'dayjs';
import { sex } from '~constant/pet';
import placeholder from 'src/images/pet-placeholder.png';

import classNames from 'classnames';
import classes from './pet-info-card.module.css';

const { Title, Text } = Typography;

type InfoItem = { icon: JSX.Element; headline: string; value: string | number };

const PetInfoCard: FC<{ pet: Pet | PetWithUser }> = ({ pet }) => {
    const age = getAge(pet.birthday);

    const infoItem: InfoItem[] = [
        {
            icon: <PawIcon />,
            headline: 'Вид питомца',
            value: pet.petType.ru,
        },
        {
            icon: <CalendarIcon />,
            headline: 'Возраст',
            value: age ?? '',
        },
        {
            icon: <GenderIcon />,
            headline: 'Пол',
            value: pet.sex ? sex[pet.sex].ru : '',
        },
        {
            icon: <HashIcon />,
            headline: 'Чип',
            value: pet.microchipId ?? '',
        },
    ].filter(item => Boolean(item.value));

    return (
        <Card
            style={{ borderRadius: '1.25rem' }}
            classNames={{ root: classes.card }}
            innerClassName={classes.card_body}
            cover={<CardImage pet={pet} />}
        >
            <div className={classes.about_pet}>
                <Title level={3} style={{ marginBottom: '0.5em' }}>
                    О питомце
                </Title>

                {pet.about && <Text>{pet.about}</Text>}

                <div className={classes.info_card_wrapper}>
                    {infoItem.map(({ icon, headline, value }) => (
                        <InfoCard key={value} icon={icon} headline={headline} text={value} />
                    ))}
                </div>
            </div>

            {'user' in pet && <OwnerCard user={pet.user} />}
        </Card>
    );
};

const OwnerCard: FC<{ user: PetWithUser['user'] }> = ({ user }) => {
    return (
        <div className={classes.about_owner}>
            <Card color="#f9fafb" variant="outlined">
                <Title level={4} style={{ marginBottom: '1rem' }}>
                    Раб питомца
                </Title>

                <div className={classes.user_info}>
                    <UserAvatar
                        avatar={user.avatar}
                        firstName={user.firstName}
                        lastName={user.lastName}
                    />
                    <PhoneLink
                        phone={user.phone}
                        asButton
                        buttonProps={{
                            block: true,
                            color: 'default',
                            variant: 'solid',
                            icon: <PhoneIcon />,
                        }}
                    />

                    <Contacts contacts={user.contacts} email={user.email} />
                </div>
            </Card>
        </div>
    );
};

const InfoCard: FC<{ icon: ReactNode; headline: string; text: string | number }> = ({
    icon,
    headline,
    text,
}) => {
    return (
        <Card color={light} innerClassName={classes.info_card}>
            <div className={classes.info_card_headline} style={{ color: cyan[5] }}>
                {icon} <span>{headline}</span>
            </div>
            <div className={classes.info_card_value}>{text}</div>
        </Card>
    );
};

const CardImage: FC<{ pet: Pet }> = ({ pet }) => {
    return (
        <Background
            className={classes.header}
            color={gray[2]}
            style={{ aspectRatio: '1/0.5', display: 'grid' }}
        >
            <img
                src={pet.image ?? placeholder}
                alt={pet.name}
                className={classNames(classes.image, { [classes.placeholder]: !pet.image })}
            />

            <div className={classes.header_overlay}>
                <div className={classes.name}>{pet.name}</div>
                {pet.breed?.ru && <div className={classes.additional_text}>{pet.breed.ru}</div>}
                <StatusTag lost={pet.lost} />
            </div>
        </Background>
    );
};

const StatusTag: FC<{ lost: boolean }> = ({ lost }) => {
    return lost ? (
        <Tag
            color="error"
            variant="solid"
            icon={<WarningIcon />}
            className={classNames(classes.tag, { [classes.lost]: lost })}
        >
            Потерян
        </Tag>
    ) : (
        <Tag color="success" variant="outlined" icon={<TickIcon />} className={classes.tag}>
            Дома
        </Tag>
    );
};

function getAge(date?: Dayjs | null): string | null {
    if (!date?.isValid()) return null;

    const currentYear = dayjs().get('year');
    const birthYear = date.get('year');

    return currentYear - birthYear + ' лет';
}

export default PetInfoCard;
