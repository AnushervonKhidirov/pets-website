import MainSection from '~section/home-page/main/main.section';
import FeatureSection from '~section/home-page/feature/feature.section';

export function meta() {
    return [{ title: 'Home page' }];
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
