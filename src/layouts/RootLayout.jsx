import { Box, Grid, GridItem, useToast } from '@chakra-ui/react';
import { Outlet, useLoaderData, useLocation, useNavigate } from 'react-router-dom';

import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';
import Login from "../pages/Login";

import useUser from "../hooks/useUser";
import axios from '../components/axios'
import { useEffect } from 'react';

const RootLayout = () => {
    const { user, setUser, deleteUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const goHomePage = () => navigate('/');

    const logout = () => {
        deleteUser();
        goHomePage();
    }

    useEffect(() => {
        // if (location.pathname == '/') {
        //     if(user?.role === 'administrator') {
        //         navigate('/staff')
        //     }
        // }

        if (location.pathname.includes('medical-records')) {
            if (!user || user?.role != 'doctor' && user?.role != 'nurse' && user?.role != 'administrator') {
                goHomePage();
                toast({
                    title: "You don't have permission to access this page",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        }
        if (location.pathname.includes('patients')) {
            if (!user || user?.role != 'doctor' && user?.role != 'nurse' && user?.role != 'administrator') {
                goHomePage();
                toast({
                    title: "You don't have permission to access this page",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        }
        if (location.pathname.includes('staff')) {
            if (!user || user?.role != 'administrator') {
                goHomePage();
                toast({
                    title: "You don't have permission to access this page",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        }

        if (location.pathname.includes('prescription') || location.pathname.includes('medicines')) {
            if (!user || user?.role != 'pharmacist' && user?.role != 'administrator') {
                goHomePage();
                toast({
                    title: "You don't have permission to access this page",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })

            }
        }
    }, [location.pathname])
    useEffect(() => {
        // CHECK IF USER EXISTS
        try {
            if (user) {
                axios.get('/user')
                    .then(res => {
                        if (res.data === null) {
                            throw Error('User not found')
                        } else {
                            setUser({
                                "user": res.data,
                                "access_token": axios.defaults.headers.common['Authorization'].split(' ')[1]
                            })
                        }
                    })
                    .catch(err => {
                        if (err.response.status === 401) {
                            console.log('LOGOUT')
                            deleteUser()
                        }
                    })
            }
        } catch (err) {
            console.log(err)
        }
        // 

    }, [])

    if (!user) {
        return <Login setUser={setUser} />
    }

    return (
        <Grid
            templateAreas={`"nav nav"
                        "` + (user ? "side" : "main") + ` main"`}
            gridTemplateRows={'auto 1fr'}
            gridTemplateColumns={{ base: '50px 1fr', lg: '250px 1fr' }}
            gap='1'
            color='blackAlpha.700'
        >
            <GridItem bg='white' p='0' borderBottom='2px' borderColor='gray.200' area={'nav'}>
                <NavBar logout={logout} user={user} />
            </GridItem>
            {user && <GridItem h='calc(100vh - 71px)' mt='-3px' bg='white' area={'side'} >
                <SideBar user={user} />
            </GridItem>}
            <GridItem pl='2' maxH='calc(100vh - 75px)' p={5} overflow='auto' area={'main'}>
                <Outlet context={user} />
            </GridItem>
        </Grid>

    );
}

export default RootLayout;