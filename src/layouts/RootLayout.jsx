import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Grid, GridItem, Spacer, Spinner, Text, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { Outlet, useLoaderData, useLocation, useNavigate } from 'react-router-dom';

// Components
import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';
import Login from "../pages/Login";
import ChatAi from '../components/ChatAi';

// Hooks
import useUser from "../hooks/useUser";
import axios from '../components/axios'
import { useEffect, CSSProperties } from 'react';

// Icons
import { SiChatbot } from 'react-icons/si';
import { useState } from 'react';
import { FaShieldVirus } from 'react-icons/fa';

// Styles
import styles from "../styles/Loading.module.css";

// Translations
import { useTranslation } from 'react-i18next';

const RootLayout = () => {
    const { user, setUser, deleteUser } = useUser();
    const [loadingPage, setLoadingPage] = useState(true);

    const { t, i18n } = useTranslation();
    const colorModeValue1 = useColorModeValue('#f8f8fb', '#333542')
    const colorModeValue2 = useColorModeValue('white', 'gray.900')
    const colorModeValue3 = useColorModeValue('gray.200', 'gray.900')
    // const [allData, setAllData] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const goHomePage = () => navigate('/');

    const { isOpen, onOpen, onClose } = useDisclosure();

    const logout = () => {
        deleteUser();
        goHomePage();
        toast({
            title: "You have been logged out",
            status: "success",
            duration: 5000,
            isClosable: true,
        })

    }
    const pathPermissions = () => {
        if (location.pathname.includes('medical-records')) {
            if (!user || user?.role != 'doctor' && user?.role != 'nurse') {
                goHomePage();
                toast({
                    title: "You don't have permission to access this page",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        } else if (location.pathname.includes('patients')) {
            if (location.pathname == '/patients') {
                if (!user || user?.role != 'doctor') {
                    goHomePage();
                    toast({
                        title: "You don't have permission to access this page",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    })
                }
            } else {
                if (!user || user?.role != 'doctor' && user?.role != 'nurse') {
                    goHomePage();
                    toast({
                        title: "You don't have permission to access this page",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    })
                }
            }

        } else if (location.pathname.includes('staff')) {
            if (!user || user?.role != 'administrator') {
                goHomePage();
                toast({
                    title: "You don't have permission to access this page",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        } else if (location.pathname.includes('prescription') || location.pathname.includes('medicines')) {
            if (!user || user?.role != 'pharmacist') {
                goHomePage();
                toast({
                    title: "You don't have permission to access this page",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })

            }
        } else if (location.pathname.includes('statistics')) {
            if (!user || user?.role != 'doctor' && user?.role != 'nurse' && user?.role != 'pharmacist') {
                goHomePage();
                toast({
                    title: "You don't have permission to access this page",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        }
    }

    const getUserInformation = () => {
        setLoadingPage(true)
        axios.get('/user')
            .then(res => {
                if (user.role != res.data.role) {
                    setUser({
                        "user": res.data,
                        "access_token": axios.defaults.headers.common['Authorization'].split(' ')[1]
                    })
                }
            })
            .catch(err => {
                if (err.response.status === 401) {
                    toast({
                        title: "Your session has expired",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    })
                    console.log('LOGOUT')
                    deleteUser()
                }
            })
            .finally(() => {
                setTimeout(() => {
                    setLoadingPage(false)
                }, 100)
            })
    }

    useEffect(() => {
        try {
            if (location.pathname && user) {
                pathPermissions();
            }
        } catch (err) {
            console.log(err);
        }
    }, [location.pathname]);

    useEffect(() => {
        try {
            if (user) {
                getUserInformation();
            }
        } catch (err) {
            console.log(err);
        }
    }, [user]);


    // if (loadingPage) {
    //     return (
    //         <Box w='100%' h='100vh' display='flex' justifyContent='center' alignItems='center' position='relative'>
    //             <FaShieldVirus fontSize='150px' color='#374083' className={styles.icon} />
    //             <Text fontSize='40px' position='absolute' bottom='0' color='#374083' fontWeight='bold'>
    //                 Infectious Diseases
    //             </Text>
    //         </Box>
    //     )
    // }

    if (!user) {
        return <Login setUser={setUser} />
    }

    return (
        <Box bg={colorModeValue1} style={{ direction: i18n.dir(), "fontFamily": i18n.dir() == 'rtl' ? "changa" : 'Light' }}>
            {loadingPage &&
                <Box w='100%' h='100vh' display='flex' justifyContent='center' alignItems='center' position='absolute' zIndex='1000'>
                    <Box position='absolute' top='0' left='0' w='100%' h='100%' bg='white' opacity='0.9'>

                    </Box>
                    <FaShieldVirus fontSize='150px' color='#374083' className={styles.icon} />
                    <Text fontSize='40px' position='absolute' bottom='10px' color='#374083' fontWeight='bold' textShadow='1px 1px 4px #000'>
                        {t('navbar.webSiteName')}
                    </Text>
                </Box>
            }
            <Grid
                templateAreas={`"nav nav"
                        "` + (user ? "side" : "main") + ` main"`}
                gridTemplateRows={'auto 1fr'}
                gridTemplateColumns={{ base: '50px 1fr', lg: '250px 1fr' }}
                gap='1'
                color='blackAlpha.700'
            >
                <GridItem bg={colorModeValue2} p='0' borderBottom='2px' borderColor={colorModeValue3} area={'nav'}>
                    <NavBar logout={logout} user={user} />
                </GridItem>
                {user && <GridItem h='calc(100vh - 71px)' mt='-3px' bg={colorModeValue2} area={'side'} >
                    <SideBar user={user} />
                </GridItem>}
                <GridItem pl='2' maxH='calc(100vh - 75px)' p={5} overflow='auto' area={'main'} style={{ overflowY: 'auto', 'scrollbarGutter': 'stable' }}>
                    <Outlet context={user} />
                </GridItem>
            </Grid>
            {user.role == 'doctor' &&
                <Box position='fixed' bottom='5' right='5' zIndex='2' onClick={onOpen} cursor='pointer' color='white' bg='blue.500' p='3' borderRadius='full'>
                    <SiChatbot size='25' />
                </Box>
            }
            <Drawer onClose={onClose} isOpen={isOpen} placement='bottom' size='full'>
                <DrawerOverlay />
                <DrawerContent height="90vh !important" bg='transparent'>
                    <DrawerBody>
                        <ChatAi />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
}

export default RootLayout;