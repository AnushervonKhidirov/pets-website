import { Link } from 'react-router';
import CountUp from 'react-countup';
import { Typography, Button } from 'antd';

import { Container, Card } from '~component/common';
import AuthButton from '~component/auth/auth-button';

import { Route } from '~constant/route';
import { PawIcon, SearchIcon, UsersIcon } from '~icons';

import logo from 'src/images/logo/logo-200x200.png';
import classes from './main.module.css';
import { light } from '~/config/ant.config';

const { Title, Text } = Typography;

const detailList = [
    {
        Icon: PawIcon,
        value: 1200,
        about: 'Питомцев',
    },
    {
        Icon: SearchIcon,
        value: 680,
        about: 'Найдено',
    },
    {
        Icon: UsersIcon,
        value: 1032,
        about: 'Пользователей',
    },
];

const MainSection = () => {
    return (
        <Container innerClassName={classes.inner_section} section color={light[0]}>
            <div className={classes.logo}>
                <img src={logo} alt="logo" />
            </div>

            <Title className={classes.headline}>
                <div>
                    Ваш питомец
                    <div className={classes.colored}>под надёжной защитой</div>
                </div>
            </Title>

            <Text type="secondary" className={classes.copy}>
                Единый реестр домашних животных. Зарегистрируйте своего друга, чтобы всегда быть на
                связи. Помогаем найти потерянных питомцев вместе.
            </Text>

            <div className={classes.buttons}>
                <AuthButton color="orange" variant="solid" size="large" contentType="sign_up" />

                <Link to={Route.Lost}>
                    <Button color="cyan" variant="outlined" size="large">
                        Потерянные питомцы
                    </Button>
                </Link>
            </div>

            <div className={classes.details}>
                {detailList.map(({ Icon, value, about }) => (
                    <Card key={about} innerClassName={classes.card} alpha={0.5}>
                        <Icon className={classes.icon} />
                        <Title level={3} className={classes.value}>
                            <CountUp end={value} separator="," enableScrollSpy scrollSpyOnce />
                        </Title>
                        <Text type="secondary" className={classes.about}>
                            {about}
                        </Text>
                    </Card>
                ))}
            </div>
        </Container>
    );
};

export default MainSection;
