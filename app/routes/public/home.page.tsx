import MainSection from '~pageComponent/home/section/main';
import FeatureSection from '~pageComponent/home/section/feature';

export function meta() {
    return [{ title: 'Главная' }];
}

const Home = () => {
    return (
        <>
            <MainSection />
            <FeatureSection />
        </>
    );
};

export default Home;
