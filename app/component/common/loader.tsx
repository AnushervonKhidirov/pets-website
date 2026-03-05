import { LoadingOutlined } from '@ant-design/icons';
import Container from './container';
import { orange } from '~/config/ant.config';

const Loader = () => {
    return (
        <Container
            section
            alpha={0}
            styles={{
                wrapper: {
                    minHeight: '100%',
                    alignContent: 'center',
                },
                content: {
                    display: 'grid',
                    justifyContent: 'center',
                },
            }}
        >
            <LoadingOutlined style={{ fontSize: '5rem', color: orange[5] }} />
        </Container>
    );
};

export default Loader;
