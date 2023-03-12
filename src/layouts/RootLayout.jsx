import { Box, Grid, GridItem } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';

import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';
import Login from "../pages/Login";

import useUser from "../components/useUser";

const RootLayout = () => {
    const { user, setUser, deleteUser } = useUser();
    const navigate = useNavigate();
    const goHomePage = () => navigate('/');

    const logout = () => {
        deleteUser();
        goHomePage();
    }
    if (!user) {
        return <Login setUser={setUser} />
    }
    return (
        <Grid
            templateAreas={`"nav nav"
                        "` + (user ? "side" : "main") + ` main"`}
            gridTemplateRows={'auto 1fr'}
            gridTemplateColumns={'250px 1fr'}
            gap='1'
            color='blackAlpha.700'
        >
            <GridItem bg='white' p='0' borderBottom='2px' borderColor='gray.200' area={'nav'}>
                <NavBar logout={logout} user={user} />
            </GridItem>
            {user && <GridItem h='calc(100vh - 71px)' mt='-3px' bg='white' area={'side'} >
                <SideBar user={user}/>
            </GridItem>}
            <GridItem pl='2' maxH='calc(100vh - 75px)' p={5} overflow='auto' area={'main'}>
                <Outlet user={user} />
            </GridItem>
        </Grid>

    );
}

export default RootLayout;