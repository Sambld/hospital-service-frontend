import { ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar, Box, Center, Flex, HStack, Spacer, Stack, Text, Icon } from "@chakra-ui/react";
import { FaShieldVirus } from "react-icons/fa";


const NavBar = () => {
    return (
        <Flex justifyContent={'space-between'} p='10px'>
            <HStack color="#374083">
                <FaShieldVirus size={40}/>
                <Text fontSize='3xl'>Infectious diseases</Text>
            </HStack>
            <Spacer />
            <Avatar size='md' name='Youcef Hemadou' src='https://scontent.fqsf1-1.fna.fbcdn.net/v/t39.30808-6/258309093_3171642829760016_7240465260934612843_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeE-EwKXIOz_ls857sQE6AJJ1nQg9dYwM3LWdCD11jAzchflAqnfgNVS0QATUceXHtr6lN0XS2LqL2CfT4zKbfxD&_nc_ohc=9anj8UlM6iYAX98naR1&_nc_ht=scontent.fqsf1-1.fna&oh=00_AfC-DukPFkNSwQ3KStcfgmqz18RMXPv1UxvjOpuT3WHOXg&oe=640FB62B' />
            <Center pl='5px'>
                <Box p='5px'>
                    <HStack>
                        <Text>Youcef Hemadou</Text>
                        <Icon as={ChevronDownIcon} boxSize={8} color='black'/>
                    </HStack>
                </Box>
            </Center>
        </Flex>
    );
}

export default NavBar;