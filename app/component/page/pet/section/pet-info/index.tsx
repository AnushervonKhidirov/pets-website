import type { FC, ReactNode } from 'react';
import type { Pet } from '~type/pet.type';
import type { Dayjs } from 'dayjs';

import { Tag, Typography } from 'antd';
import { cyan, light } from '~/config/ant.config';
import {
    PawIcon,
    TickIcon,
    WarningIcon,
    MaleIcon,
    FemaleIcon,
    HashIcon,
    CalendarIcon,
    PhoneIcon,
} from '~icons';
import { Background, Container, Card, UserAvatar, PhoneLink, Contacts } from '~component/common';

import dayjs from 'dayjs';
import { sex } from '~constant/pet';
import classNames from 'classnames';
import classes from './pet-info.module.css';

const { Title, Text } = Typography;

const GenderIcon = {
    Male: <MaleIcon />,
    Female: <FemaleIcon />,
};

const PetInfoSection: FC<{ pet: Pet }> = ({ pet }) => {
    const age = getAge(pet.birthday);

    return (
        <Container section maxWidth={1000}>
            <Card
                style={{ borderRadius: '1.25rem' }}
                innerClassName={classes.card_body}
                cover={<CardImage pet={pet} />}
            >
                <div className={classes.about_pet}>
                    <Title level={3} style={{ marginBottom: '0.5em' }}>
                        О питомце
                    </Title>

                    {pet.about && <Text>{pet.about}</Text>}

                    <div className={classes.info_card_wrapper}>
                        <InfoCard Icon={<PawIcon />} headline="Тип питомца" text={pet.petType.ru} />
                        {age && <InfoCard Icon={<CalendarIcon />} headline="Возраст" text={age} />}

                        {pet.sex && (
                            <InfoCard
                                Icon={GenderIcon[pet.sex]}
                                headline="Пол"
                                text={sex[pet.sex].ru}
                            />
                        )}

                        {pet.microchipId && (
                            <InfoCard Icon={<HashIcon />} headline="Чип" text={pet.microchipId} />
                        )}
                    </div>
                </div>

                <div className={classes.about_owner}>
                    <Card color="#f9fafb" variant="outlined">
                        <Title level={4} style={{ marginBottom: '1rem' }}>
                            Раб питомца
                        </Title>

                        <div className={classes.user_info}>
                            <UserAvatar
                                firstName={pet.user.firstName}
                                lastName={pet.user.lastName}
                            />
                            <PhoneLink
                                phone={pet.user.phone}
                                asButton
                                buttonProps={{
                                    block: true,
                                    color: 'default',
                                    variant: 'solid',
                                    icon: <PhoneIcon />,
                                }}
                            />

                            <Contacts contacts={pet.user.contacts} email={pet.user.email} />
                        </div>
                    </Card>
                </div>
            </Card>
        </Container>
    );
};

const InfoCard: FC<{ Icon: ReactNode; headline: string; text: string | number }> = ({
    Icon,
    headline,
    text,
}) => {
    return (
        <Card color={light} innerClassName={classes.info_card}>
            <div className={classes.info_card_headline} style={{ color: cyan[5] }}>
                {Icon} <span>{headline}</span>
            </div>
            <div className={classes.info_card_value}>{text}</div>
        </Card>
    );
};

const CardImage: FC<{ pet: Pet }> = ({ pet }) => {
    const additionalText = [pet.breed?.ru, getAge(pet.birthday), pet.sex && sex[pet.sex].ru]
        .filter(Boolean)
        .join(' • ');

    return (
        <Background
            className={classes.header}
            color={cyan[0]}
            style={{ aspectRatio: '1/0.5', display: 'grid' }}
        >
            {pet.image ? (
                <img src={pet.image} alt={pet.name} className={classes.image} />
            ) : (
                <PawIcon style={{ fontSize: '5rem', color: cyan[5] }} />
            )}

            <div className={classes.header_overlay}>
                <div className={classes.name}>{pet.name}</div>
                {additionalText && <div className={classes.additional_text}>{additionalText}</div>}
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

export default PetInfoSection;
