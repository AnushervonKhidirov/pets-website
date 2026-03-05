import type { FC } from 'react';
import type { EmptyProps } from 'antd';

import { Empty as AntEmpty } from 'antd';

import funnyCat from 'src/images/funny-cat.png';

const Empty: FC<EmptyProps> = ({ description, ...props }) => {
    return (
        <AntEmpty
            image={funnyCat}
            description={description ?? "Тут пусто"}
            styles={{
                image: { height: '10rem', marginTop: '5rem', marginBottom: '1rem' },
            }}
            {...props}
        />
    );
};

export default Empty;
