import { Box, Grid, GridItem } from '@chakra-ui/react';
import {  Outlet } from 'react-router-dom';
import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';


const RootLayout = () => {
    return ( 
        <Grid
        templateAreas={`"nav nav"
                        "side main"`}
        gridTemplateColumns={'250px 1fr'}
        h='200px'
        gap='1'
        color='blackAlpha.700'
        >
        <GridItem bg='white' p='0' borderBottom='2px' borderColor='gray.200'  area={'nav'}>
            <NavBar/>
        </GridItem>
        <GridItem h='calc(100vh - 71px)' mt='-3px' bg='white' area={'side'} >
            <SideBar />
        </GridItem>
        <GridItem pl='2' p={5}  overflow='auto' area={'main'}>
            <Outlet/>
        </GridItem>
        </Grid>
        
     );
}
 
export default RootLayout;