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
import { useRef, useState } from "react";
import { FaShieldVirus, FaUserNurse, FaUserMd } from "react-icons/fa";
import { RiShutDownLine, RiAdminLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { GiMedicines } from "react-icons/gi";

const UserRoleItem = (user) => {
    let items = [];
    if (user.role === 's') {
        items = [<RiAdminLine fontSize='1.5rem' />, <RiAdminLine fontSize='4rem' />, 'black']
    } else if (user.role === 'd') {
        items = [<FaUserMd fontSize='1.5rem' />, <FaUserMd fontSize='4rem' />, 'red.500']
    } else if (user.role === 'n') {
        items = [<FaUserNurse fontSize='1.5rem' />, <FaUserNurse fontSize='4rem' />, 'blue.500']
    } else if (user.role === 'p') {
        items = [<GiMedicines fontSize='1.5rem' />, <GiMedicines fontSize='4rem' />,'green.500']
    } else return null;
    return items;
}

const NavBar = ({ logout, user }) => {
    const [UserRoleIcon, setUserRoleItem] = useState(UserRoleItem(user));
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()

    const [Leading, setLeading] = useState(false);
    const handleLogout = () => {
        setLeading(true);
        setTimeout(() => {
            setLeading(false);
            logout();
        }, 1000);
    }
    return (
        <Flex justifyContent={'space-between'} p='10px'>
            <HStack color="#374083">
                <FaShieldVirus size={40} />
                <Text fontSize='3xl'>Infectious diseases</Text>
            </HStack>
            <Spacer />
            <Avatar
                bg={UserRoleIcon && UserRoleIcon[2]}
                size='md'
                icon={UserRoleIcon && UserRoleIcon[0]}
            />
            <Center pl='5px' alignItems={'center'}>
                <Menu isLazy>
                    <MenuButton>
                        <Box p='5px'>
                            <HStack>
                                <Text>{user.first_name + " " + user.last_name}</Text>
                                <Icon as={ChevronDownIcon} boxSize={8} color='black' />
                            </HStack>
                        </Box>
                    </MenuButton>
                    <MenuList mt='10px' p='5px' borderTopLeftRadius={0} borderTopRightRadius={0}>
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
                        <Flex justifyContent='flex-end'>
                            <Button onClick={onOpen} colorScheme='red' variant='outline' mt='10px' p='10px'>
                                <Text mr='5px' color='red.500' fontSize={12} fontWeight='normal'>Sign out</Text>
                                <Icon as={RiShutDownLine} boxSize={4} color='red.500' />
                            </Button>
                        </Flex>


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