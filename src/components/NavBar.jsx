import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    Center,
    Flex,
    HStack,
    Spacer,
    Text,
    Icon,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Divider,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaShieldVirus, FaUserNurse, FaUserMd } from "react-icons/fa";
import { RiShutDownLine, RiAdminLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { GiMedicines } from "react-icons/gi";

const UserRoleItem = (user) => {
    let items = [];
    try {
        if (user.role === 'administrator') {
            items = [<RiAdminLine fontSize={{ base: '1rem', md: '1.5rem' }} />, <RiAdminLine fontSize='4rem' />, 'black']
        } else if (user.role === 'doctor') {
            items = [<FaUserMd fontSize={{ base: '1rem', md: '1.5rem' }} />, <FaUserMd fontSize='4rem' />, 'red.500']
        } else if (user.role === 'nurse') {
            items = [<FaUserNurse fontSize={{ base: '1rem', md: '1.5rem' }} />, <FaUserNurse fontSize='4rem' />, 'blue.500']
        } else if (user.role === 'pharmacist') {
            items = [<GiMedicines fontSize={{ base: '1rem', md: '1.5rem' }} />, <GiMedicines fontSize='4rem' />, 'green.500']
        }
        return items;
    } catch { return items; }
}

const NavBar = ({ logout, user }) => {
    const [UserRoleIcon, setUserRoleItem] = useState(UserRoleItem(user));
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()

    const [Leading, setLeading] = useState(false);

    useEffect(() => {
        setUserRoleItem(UserRoleItem(user));
    }, [user])
    
    const handleLogout = () => {
        setLeading(true);
        setTimeout(() => {
            setLeading(false);
            logout();
        }, 1000);
    }

    return (
        <Flex justifyContent={'space-between'} p={{ base: '5px', lg: '10px' }}>
            <HStack color="#374083">
                <FaShieldVirus fontSize='40px'/>
                <Text fontSize={{ base: 'md', lg: '3xl' }}>Infectious Diseases</Text>
            </HStack>
            <Spacer />

            <Center pl='5px' alignItems={'center'}>
                <Avatar
                    bg={UserRoleIcon && UserRoleIcon[2]}
                    size={{ base: 'sm', lg: 'md' }}
                    icon={UserRoleIcon && UserRoleIcon[0]}
                />
                <Menu isLazy>
                    <MenuButton>
                        <Box p='5px'>
                            <HStack>
                                <Text fontSize={{ base: 'sm', lg: 'md' }}>{user.first_name + " " + user.last_name}</Text>
                                <Icon as={ChevronDownIcon} boxSize={8} color='black' />
                            </HStack>
                        </Box>
                    </MenuButton>
                    <MenuList mt='10px' p='5px' borderTopLeftRadius={0} borderTopRightRadius={0} zIndex={5}>
                        <br />
                        <Center>
                            <Avatar
                                bg={UserRoleIcon && UserRoleIcon[2]}
                                size={'2xl'}
                                icon={UserRoleIcon && UserRoleIcon[1]}
                            />
                        </Center>
                        <br />
                        <Center>
                            <p>{user.first_name + " " + user.last_name}</p>
                        </Center>
                        <br />
                        <Divider />
                        <NavLink to='/profile'>
                            <MenuItem>
                                <Text>Profile</Text>
                            </MenuItem>
                        </NavLink>
                        <NavLink to='/settings'>
                            <MenuItem>
                                <Text>settings</Text>
                            </MenuItem>
                        </NavLink>
                        <Divider mt='10px' />
                        <MenuItem onClick={onOpen}>
                            <Text color='red.500' fontWeight='normal'>Sign out</Text>
                            <Spacer />
                            <Icon as={RiShutDownLine} boxSize={5} color='red.500' />
                            {/* <Button color='red.500' fontWeight='normal' variant='ghost' size='sm'>
                                <RiShutDownLine />
                            </Button> */}
                        </MenuItem>
                        {/* <Flex justifyContent='flex-end'>
                            <Button onClick={onOpen} colorScheme='red' variant='outline' mt='10px' p='10px'>
                                <Text mr='5px' color='red.500' fontSize={15} fontWeight='normal'>Sign out</Text>
                                <Icon as={RiShutDownLine} boxSize={4} color='red.500' />
                            </Button>
                        </Flex> */}


                    </MenuList>
                </Menu>


            </Center>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent maxW='300px' p='20px'>

                        <AlertDialogBody textAlign='center'>
                            Are you sure? you want to sign out
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={handleLogout} w='100%' fontWeight='normal' isLoading={Leading}>
                                Sign out
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Flex>
    );
}

export default NavBar;