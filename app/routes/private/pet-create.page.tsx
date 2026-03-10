import { Typography } from 'antd';
import { Container } from '~component/common';

import PetForm from '~component/pet/pet-form';

export function meta() {
    return [{ title: 'Создание питомца' }];
}

const { Title } = Typography;

const MyPetSettingPage = () => {
    return (
        <Container section style={{ minHeight: '100%' }}>
            <Title level={3}>Создание питомца</Title>
            <PetForm />
        </Container>
    );
};

export default MyPetSettingPage;
