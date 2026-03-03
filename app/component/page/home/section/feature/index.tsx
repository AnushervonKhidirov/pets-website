import { Typography } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';
import { Container, Grid, Card, Background } from '~component/common';
import { SearchIcon, UserIcon, PawIcon, PetPassportIcon } from '~icons';

import { cyan, orange } from '~/config/ant.config';
import classes from './feature.module.css';

const { Title, Text, Paragraph } = Typography;

const featureList = [
    {
        Icon: UserIcon,
        title: 'Создайте личный аккаунт',
        about: (
            <>
                Зарегистрируйтесь на платформе за пару кликов. Это <b>полностью бесплатно</b> и
                позволяет управлять профилями всех ваших животных в одном месте.
            </>
        ),
    },
    {
        Icon: PawIcon,
        title: 'Добавьте своего питомца',
        about: 'Привяжите любимца к вашему аккаунту, заполнив базовую информацию. Вы можете создать неограниченное количество карточек для каждого своего подопечного.',
    },
    {
        Icon: QrcodeOutlined,
        title: 'QR-код на адреснике',
        about: 'Каждый профиль получает уникальную ссылку и QR-код. Разместите его на ошейнике или адреснике — так любой человек, встретивший вашего питомца, сможет мгновенно открыть его страницу и связаться с вами.',
    },
    {
        Icon: PetPassportIcon,
        title: 'Цифровой паспорт',
        about: (
            <>
                <Paragraph>
                    Зарегистрируйтесь на платформе за пару кликов. Это <b>полностью бесплатно</b> и
                    позволяет управлять профилями всех ваших животных в одном месте.
                </Paragraph>

                <Paragraph type="warning" italic>
                    Важно: цифровой паспорт является вспомогательным инструментом и{' '}
                    <b>не является официальным</b> ветеринарным или юридическим документом.
                </Paragraph>
            </>
        ),
    },
    {
        Icon: SearchIcon,
        title: 'Объявление о пропаже',
        about: (
            <>
                <Paragraph>
                    Если случилась беда, вы можете в один клик отправить анкету питомца в раздел
                    «Потерянные».
                </Paragraph>

                <Paragraph>
                    <b>Мы не занимаемся поиском</b> самостоятельно, но помогаем людям, нашедшим ваше
                    животное, быстро вас идентифицировать
                </Paragraph>
            </>
        ),
    },
];

const FeatureSection = () => {
    return (
        <Container innerClassName={classes.inner_section} section>
            <Title level={3} style={{ color: orange[5] }}>
                Как работает
            </Title>
            <Title level={4} style={{ marginTop: 0 }}>
                Помогаем вашим питомцам вернуться домой быстрее
            </Title>

            <Grid className={classes.list}>
                {featureList.map(({ Icon, title, about }) => (
                    <Card key={title} innerClassName={classes.card}>
                        <Background
                            style={{ width: '3rem', height: '3rem' }}
                            className={classes.icon}
                            color={cyan[0]}
                            alpha={0.75}
                        >
                            <Icon />
                        </Background>

                        <Title level={5} className={classes.title}>
                            {title}
                        </Title>

                        <Text className={classes.about}>{about}</Text>
                    </Card>
                ))}
            </Grid>
        </Container>
    );
};

export default FeatureSection;
