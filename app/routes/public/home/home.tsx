import type { Route } from './+types/home';

import MainSection from '~section/home-page/main/main.section';
import FeatureSection from '~section/home-page/feature/feature.section';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Home page' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Home() {
    return (
        <>
            <MainSection />
            <FeatureSection />
            <MainSection />
        </>
    );
}
