import { LoadingOutlined } from '@ant-design/icons';
import Container from './container';
import { orange } from '~/config/ant.config';

const Loader = () => {
    return (
        <Container
            section
            styles={{
                wrapper: {
                    height: '100%',
                },
                content: {
                    display: 'grid',
                    alignContent: 'center',
                    justifyItems: 'center',
                },
            }}
        >
            <LoadingOutlined style={{ fontSize: '5rem', color: orange[5] }} />
        </Container>
    );
};

export default Loader;
