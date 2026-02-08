import Container from '~commons/container/container';
import Button from '~commons/button/button';

import { Route } from '~constant/route';
import { Paw, Search, Users } from '~icons/icons';

import logo from 'src/images/logo/logo-200x200.png';
import classes from './main.module.css';

const MainSection = () => {
    return (
        <Container className={classes.section} innerClassName={classes.inner_section}>
            <div className={classes.logo}>
                <img src={logo} alt="logo" />
            </div>

            <h1 className={classes.headline}>
                Ваш питомец
                <div className={classes.colored}>под надёжной защитой</div>
            </h1>

            <div className={classes.copy}>
                Единый реестр домашних животных. Зарегистрируйте своего друга, чтобы всегда быть на
                связи. Помогаем найти потерянных питомцев вместе.
            </div>

            <div className={classes.buttons}>
                <Button color="secondary" size="large" href={Route.SignUp}>
                    Зарегистрировать
                </Button>

                <Button type="outlined" size="large" href={Route.Lost}>
                    Потерянные питомцы
                </Button>
            </div>

            <div className={classes.details}>
                <div className={classes.card}>
                    <div className={classes.icon}>
                        <Paw />
                    </div>
                    <div className={classes.value}>500+</div>
                    <div className={classes.about}>Питомцев</div>
                </div>

                <div className={classes.card}>
                    <div className={classes.icon}>
                        <Search />
                    </div>
                    <div className={classes.value}>50+</div>
                    <div className={classes.about}>Найдено</div>
                </div>

                <div className={classes.card}>
                    <div className={classes.icon}>
                        <Users />
                    </div>
                    <div className={classes.value}>475+</div>
                    <div className={classes.about}>Пользователей</div>
                </div>
            </div>
        </Container>
    );
};

export default MainSection;
