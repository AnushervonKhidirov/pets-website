import type { FC, JSX } from 'react';
import type { DropdownProps, MenuProps } from 'antd';
import type { Pet, PetWithUser } from '~type/pet.type';
import type { WithAdditionalProps } from '~type/common.type';

import { Dropdown, Tag, Typography } from 'antd';
import { red } from '@ant-design/colors';
import { Background, Card, UserAvatar, PhoneLink, Contacts } from '~component/common';
import { MoreOutlined } from '@ant-design/icons';
import {
    PawIcon,
    TickIcon,
    WarningIcon,
    GenderIcon,
    HashIcon,
    CalendarIcon,
    PhoneIcon,
} from '~icons';

import { cyan, gray, light } from '~/config/ant.config';
import { sex } from '~constant/pet';
import placeholder from 'src/images/pet-placeholder.png';

import classNames from 'classnames';
import classes from './pet-info-card.module.css';

const { Title, Text } = Typography;

type PetInfoCardProps = WithAdditionalProps<{
    pet: Pet | PetWithUser;
    actions?: MenuProps['items'];
}>;

type InfoItem = { icon: JSX.Element; headline: string; value: string | number; isDanger?: boolean };

const PetInfoCard: FC<PetInfoCardProps> = ({ pet, children, actions }) => {
    const infoItem: InfoItem[] = [
        {
            icon: <PawIcon />,
            headline: 'Вид',
            value: pet.petType.ru,
        },
        {
            icon: <CalendarIcon />,
            headline: 'Возраст',
            value: pet.birthday?.isValid() ? pet.birthday.toNow(true) : '',
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
        {
            icon: <WarningIcon />,
            headline: 'Дата пропажи',
            value: pet.lostAt?.startOf('day').format('DD MMMM YYYY') ?? '',
            isDanger: true,
        },
    ].filter(item => Boolean(item.value));

    return (
        <Card
            style={{ borderRadius: '1.25rem' }}
            classNames={{ root: classes.card }}
            innerClassName={classes.card_body}
            cover={<CardHeader pet={pet} actions={actions} />}
        >
            <div className={classes.about_pet}>
                <Title level={3} style={{ marginBottom: '0.5em' }}>
                    О питомце
                </Title>

                {pet.about && <Text>{pet.about}</Text>}

                <div className={classes.info_card_wrapper}>
                    {infoItem.map(({ icon, headline, value, isDanger = undefined }) => (
                        <InfoCard
                            key={value}
                            icon={icon}
                            headline={headline}
                            value={value}
                            isDanger={isDanger}
                        />
                    ))}
                </div>
            </div>

            {'user' in pet && <OwnerCard user={pet.user} />}

            {children ? <div>{children}</div> : null}
        </Card>
    );
};

const CardHeader: FC<{ pet: Pet; actions?: MenuProps['items'] }> = ({ pet, actions }) => {
    const sharedProps: DropdownProps = {
        menu: { items: actions },
        placement: 'bottomRight',
        trigger: ['click'],
        styles: { item: { padding: 0 } },
    };

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
                {pet.breed?.ru && <div className={classes.breed}>{pet.breed.ru}</div>}
                <StatusTag lost={pet.lost} />

                {actions && (
                    <Dropdown {...sharedProps}>
                        <Background style={{ width: 'auto' }} className={classes.more_btn}>
                            <MoreOutlined />
                        </Background>
                    </Dropdown>
                )}
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

const InfoCard: FC<InfoItem> = ({ icon, headline, value, isDanger }) => {
    const cardColor = isDanger ? red[0] : light;
    const headlineColor = isDanger ? red[5] : cyan[5];

    return (
        <Card
            color={cardColor}
            innerClassName={classNames(classes.info_card, { [classes.danger]: isDanger })}
            variant={isDanger ? 'outlined' : 'borderless'}
            style={{ borderColor: red[2] }}
        >
            <div className={classes.info_card_headline} style={{ color: headlineColor }}>
                {icon} <span>{headline}</span>
            </div>
            <div className={classes.info_card_value}>{value}</div>
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

export default PetInfoCard;
