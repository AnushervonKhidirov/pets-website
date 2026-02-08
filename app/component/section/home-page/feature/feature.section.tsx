import Container from '~commons/container/container';
import Grid from '~commons/grid/grid';
import Card from '~commons/card/card';
import { Shield, Search, Heart } from '~icons/icons';

import classes from './feature.module.css';

const FeatureSection = () => {
    return (
        <Container innerClassName={classes.inner_section} section>
            <h6 className={classes.sup_headline}>Возможности</h6>
            <h3>Всё для безопасности вашего друга</h3>

            <Grid className={classes.list}>
                <Card className={classes.card} shadow colored>
                    <div className={classes.icon}>
                        <Shield />
                    </div>
                    <h6 className={classes.title}>Регистрация питомца</h6>
                    <div className={classes.about}>
                        Создайте цифровой паспорт для вашего любимца. Храните данные о чипе,
                        прививках и особых приметах в одном месте.
                    </div>
                </Card>

                <Card className={classes.card} shadow colored>
                    <div className={classes.icon}>
                        <Search />
                    </div>
                    <h6 className={classes.title}>Поиск потерянных</h6>
                    <div className={classes.about}>
                        Мгновенно публикуйте объявления о пропаже. Наше сообщество поможет вернуть
                        друга домой как можно скорее.
                    </div>
                </Card>

                <Card className={classes.card} shadow colored>
                    <div className={classes.icon}>
                        <Heart />
                    </div>
                    <h6 className={classes.title}>Сообщество</h6>
                    <div className={classes.about}>
                        Объединяем людей, неравнодушных к животным. Делитесь опытом, находите друзей
                        и помогайте другим.
                    </div>
                </Card>
            </Grid>
        </Container>
    );
};

export default FeatureSection;
