import type { CSSProperties, FC } from 'react';
import type { DropdownProps, MenuProps } from 'antd';
import type { WithAdditionalProps } from '~type/common.type';
import type { LostPet, Pet, PetWithUser } from '~type/pet.type';
import type { LostInfo } from '~type/lost-info.type';

import { Dropdown, Tag, Typography, Descriptions } from 'antd';
import { red } from '@ant-design/colors';
import { Background, Card, UserAvatar, PhoneLink, Contacts, QRCode } from '~component/common';
import { MoreOutlined } from '@ant-design/icons';
import { TickIcon, WarningIcon, ClockIcon, LocationIcon } from '~icons';

import { cyan, orange, gray, light } from '~/config/ant.config';
import { sex } from '~constant/pet';
import { Route } from '~constant/route';
import placeholder from 'src/images/pet-placeholder.png';

import classNames from 'classnames';
import classes from './pet-info-card.module.css';

const { Title, Text } = Typography;

type PetInfoCardProps = WithAdditionalProps<{
    pet: Pet | PetWithUser;
    hoverable?: boolean;
    hideBody?: boolean;
    showQR?: boolean;
    showOwner?: boolean;
    actions?: MenuProps['items'];
    style?: CSSProperties;
}>;

type LostPetInfoCardProps = WithAdditionalProps<{
    pet: LostPet;
    style?: CSSProperties;
}>;

const PetInfoCard: FC<PetInfoCardProps> = ({
    pet,
    hoverable,
    hideBody,
    showQR,
    showOwner,
    actions,
    children,
    style = {},
}) => {
    const petProfilePage = `${Route.PetInfo}/${pet.id}`;

    const infoItems = [
        {
            key: pet.id + 'petType',
            label: 'Вид',
            children: pet.petType.ru,
        },
        {
            key: pet.id + 'birthday',
            label: 'Возраст',
            children: pet.birthday?.isValid() ? pet.birthday.toNow(true) : null,
        },
        {
            key: pet.id + 'sex',
            label: 'Пол',
            children: pet.sex ? sex[pet.sex].ru : null,
        },
        {
            key: pet.id + 'microchipId',
            label: 'Чип',
            children: pet.microchipId ?? null,
        },
    ].filter(item => item.children);

    return (
        <Card
            hoverable={hoverable}
            style={{ borderRadius: '1.25rem', ...style }}
            classNames={{ root: classes.card }}
            innerClassName={classes.card_body}
            cover={<CardHeader pet={pet} actions={actions} />}
        >
            {!hideBody && (
                <>
                    <div className={classes.main_info}>
                        <div>
                            <Title level={3} style={{ marginBottom: '0.25em' }}>
                                О питомце
                            </Title>

                            {pet.about && <Text>{pet.about}</Text>}
                        </div>

                        <Descriptions
                            column={{ md: 2, lg: 2, xl: 2, xxl: 2 }}
                            styles={{ label: { color: cyan[5], fontWeight: 500 } }}
                            items={infoItems}
                        />

                        <div>{pet.lostInfo && <LostInfoCard lostInfo={pet.lostInfo} />}</div>
                    </div>

                    <div className={classes.additional_info}>
                        {showQR && (
                            <QRCode
                                name={pet.name}
                                value={globalThis.location.origin + petProfilePage}
                            />
                        )}

                        {'user' in pet && showOwner && <OwnerCard user={pet.user} />}

                        {children}
                    </div>
                </>
            )}
        </Card>
    );
};

export const LostPetInfoCard: FC<LostPetInfoCardProps> = ({ pet, style = {}, children }) => {
    return (
        <Card
            style={{ borderRadius: '1.25rem', ...style }}
            classNames={{ root: classes.card }}
            innerClassName={classes.lost_card_body}
            cover={<CardHeader pet={pet} />}
        >
            <div className={classes.lost_card_info_list}>
                <div className={classes.lost_card_info_item}>
                    <ClockIcon style={{ color: cyan[5], fontSize: '1.2em' }} />
                    <span style={{ color: gray[7] }}>
                        {pet.lostInfo.lostAt.startOf('day').format('DD MMMM YYYY')}
                    </span>
                </div>

                {pet.lostInfo.address && (
                    <div className={classes.lost_card_info_item}>
                        <LocationIcon style={{ color: orange[5], fontSize: '1.2em' }} />
                        <span style={{ color: gray[7] }}>{pet.lostInfo.address}</span>
                    </div>
                )}

                {pet.lostInfo.details && (
                    <Card
                        size="small"
                        variant="outlined"
                        innerClassName={classes.lost_card_info_detail}
                        color={light}
                    >
                        <span style={{ color: gray[5], fontSize: '0.9em' }}>
                            "{pet.lostInfo.details}"
                        </span>
                    </Card>
                )}
            </div>

            {children}
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
                <StatusTag lost={!!pet.lostInfo} />

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

const LostInfoCard: FC<{ lostInfo: LostInfo; style?: CSSProperties }> = ({ lostInfo, style }) => {
    const lostInfoItems = [
        {
            key: lostInfo.id + lostInfo.petId + 'date',
            label: 'Дата',
            children: lostInfo.lostAt.startOf('day').format('DD MMMM YYYY'),
        },
        {
            key: lostInfo.id + lostInfo.petId + 'place',
            label: 'Место',
            children: lostInfo.address,
        },
        {
            key: lostInfo.id + lostInfo.petId + 'details',
            label: 'Обстоятельства',
            children: lostInfo.details,
        },
    ].filter(item => item.children);

    return (
        <Card
            color={red[0]}
            innerClassName={classNames(classes.lost_info_card, classes.danger)}
            variant="outlined"
            style={{ borderColor: red[2], ...style }}
        >
            <div
                className={classNames(classes.lost_info_card_headline, classes.info_title)}
                style={{ color: red[5] }}
            >
                <WarningIcon /> <span>Информация о пропаже</span>
            </div>

            <Descriptions
                column={1}
                layout="vertical"
                styles={{ label: { color: '#000', fontWeight: 700 } }}
                items={lostInfoItems}
            />
        </Card>
    );
};

const OwnerCard: FC<{ user: PetWithUser['user'] }> = ({ user }) => {
    return (
        <div className={classes.about_owner}>
            <Card color="#f9fafb" variant="outlined">
                <Title level={4} style={{ marginBottom: '1rem' }}>
                    Владелец
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
                        includeIcon
                        buttonProps={{
                            block: true,
                            color: 'default',
                            variant: 'solid',
                        }}
                    />

                    <Contacts contacts={user.contacts} email={user.email} />
                </div>
            </Card>
        </div>
    );
};

export default PetInfoCard;
