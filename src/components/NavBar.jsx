import { ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar, Box, Center, Flex, HStack, Spacer, Stack, Text, Icon, Button, Menu, MenuButton, MenuList, MenuItem, MenuGroup, Divider } from "@chakra-ui/react";
import { FaShieldVirus } from "react-icons/fa";
import { RiShutDownLine } from "react-icons/ri";


const NavBar = ({ logout, user }) => {
    return (
        <Flex justifyContent={'space-between'} p='10px'>
            <HStack color="#374083">
                <FaShieldVirus size={40} />
                <Text fontSize='3xl'>Infectious diseases</Text>
            </HStack>
            <Spacer />
            <Avatar size='md' name={user.first_name + " " + user.last_name} />
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
                                size={'2xl'}
                                name={user.first_name + " " + user.last_name}
                            />
                        </Center>
                        <br />
                        <Center>
                            <p>{user.first_name + " " + user.last_name}</p>
                        </Center>
                        <br />
                        <Flex justify='space-between' p='10px'>
                            <Center><Text fontSize='xl' color='red.500'>Logout</Text></Center>
                            <Button onClick={logout} variant='outline' colorScheme='red'>
                                <Icon as={RiShutDownLine} boxSize={6} color='red.500' />
                            </Button>
                        </Flex>

                    </MenuList>
                </Menu>


            </Center>

        </Flex>
    );
}

export default NavBar;