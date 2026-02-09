import { Link } from 'react-router';
import { Typography, Button } from 'antd';

import Container from '~commons/container/container';
import MyCard from '~commons/card/card';
import AuthButton from '~component/auth/auth-button';

import { Route } from '~constant/route';
import { PawIcon, SearchIcon, UsersIcon } from '~icons/icons';

import logo from 'src/images/logo/logo-200x200.png';
import classes from './main.module.css';

const { Title, Text } = Typography;

const detailList = [
    {
        Icon: PawIcon,
        value: '500+',
        about: 'Питомцев',
    },
    {
        Icon: SearchIcon,
        value: '50+',
        about: 'Найдено',
    },
    {
        Icon: UsersIcon,
        value: '475+',
        about: 'Пользователей',
    },
];

const MainSection = () => {
    return (
        <Container innerClassName={classes.inner_section} section colored>
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
                    <MyCard className={classes.card} key={about}>
                        <Icon className={classes.icon} />
                        <Title level={3} className={classes.value}>
                            {value}
                        </Title>
                        <Text type="secondary" className={classes.about}>
                            {about}
                        </Text>
                    </MyCard>
                ))}
            </div>
        </Container>
    );
};

export default MainSection;
