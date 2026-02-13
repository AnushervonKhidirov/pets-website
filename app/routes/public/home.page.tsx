import MainSection from '~pageComponent/home/section/main';
import FeatureSection from '~pageComponent/home/section/feature';

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
