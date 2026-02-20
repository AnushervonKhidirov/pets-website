import { LoadingOutlined } from '@ant-design/icons';
import Container from './container';
import { orange } from '~/config/ant.config';

const Loader = () => {
    return (
        <Container
            section
            style={{
                display: 'grid',
                alignContent: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
            }}
        >
            <LoadingOutlined style={{ fontSize: '5rem', color: orange[5] }} />
        </Container>
    );
};

export default Loader;
