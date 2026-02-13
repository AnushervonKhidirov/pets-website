import { Typography } from 'antd';
import { Container, Grid, Card, Background } from '~component/common';
import { ShieldIcon, SearchIcon, HeartIcon } from '~icons';

import { cyan, orange } from '~/config/ant.config';
import classes from './feature.module.css';

const { Title, Text } = Typography;

const featureList = [
    {
        Icon: ShieldIcon,
        title: 'Регистрация питомца',
        about: 'Создайте цифровой паспорт для вашего любимца. Храните данные о чипе, прививках и особых приметах в одном месте.',
    },
    {
        Icon: SearchIcon,
        title: 'Поиск потерянных',
        about: 'Мгновенно публикуйте объявления о пропаже. Наше сообщество поможет вернуть друга домой как можно скорее.',
    },
    {
        Icon: HeartIcon,
        title: 'Сообщество',
        about: 'Объединяем людей, неравнодушных к животным. Делитесь опытом, находите друзей и помогайте другим.',
    },
];

const FeatureSection = () => {
    return (
        <Container innerClassName={classes.inner_section} section>
            <Text className={classes.sup_headline}>Возможности</Text>
            <Title level={3}>Всё для безопасности вашего друга</Title>

            <Grid className={classes.list}>
                {featureList.map(({ Icon, title, about }) => (
                    <Card key={title} innerClassName={classes.card} color={orange[0]}>
                        <Background
                            style={{ width: '3rem', height: '3rem' }}
                            className={classes.icon}
                            color={cyan[0]}
                            alpha={0.75}
                        >
                            <Icon />
                        </Background>

                        <Text strong className={classes.title}>
                            {title}
                        </Text>

                        <Text type="secondary" className={classes.about}>
                            {about}
                        </Text>
                    </Card>
                ))}
            </Grid>
        </Container>
    );
};

export default FeatureSection;
