import MyPets from '~pageComponent/profile/section/my-pets';

export function meta() {
    return [{ title: 'My pets' }];
}

const Pets = () => {
    return <MyPets />;
};

export default Pets;
