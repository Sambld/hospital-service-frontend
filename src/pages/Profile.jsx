import { Box, HStack, Avatar, Text, Table, Tbody, Tr, Td, Divider } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { FaShieldVirus, FaUserNurse, FaUserMd } from "react-icons/fa";
import { RiShutDownLine, RiAdminLine } from "react-icons/ri";
import { GiMedicines } from "react-icons/gi";
import styles from '../styles/Profile.module.css';

const UserRoleItem = (user) => {
    let items = [];
    try {
        if (user.role === 'administrator') {
            items = [<RiAdminLine fontSize={{ base: '2rem', md: '2.5rem' }} />, <RiAdminLine fontSize='4rem' />, 'black']
        } else if (user.role === 'doctor') {
            items = [<FaUserMd fontSize={{ base: '2rem', md: '2.5rem' }} />, <FaUserMd fontSize='4rem' />, 'red.500']
        } else if (user.role === 'nurse') {
            items = [<FaUserNurse fontSize={{ base: '2rem', md: '2.5rem' }} />, <FaUserNurse fontSize='4rem' />, 'blue.500']
        } else if (user.role === 'pharmacist') {
            items = [<GiMedicines fontSize={{ base: '2rem', md: '2.5rem' }} />, <GiMedicines fontSize='4rem' />, 'green.500']
        }
        return items;
    } catch { return items; }
}

const Profile = () => {
    const user = useOutletContext()
    const [UserRoleIcon, setUserRoleItem] = useState(UserRoleItem(user));

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };
    return (
        <Box bg='white' w='100%' m='10px' p='20px' border='2px' borderColor='gray.200' borderRadius='2xl'>
            <Text mb={2} fontSize='2xl' color='#2e3149'>{`${user.first_name} ${user.last_name}`}</Text>
            <Divider />
            <Box p={2} mt={2} mb={2}>
                <Table className={styles.table} variant="unstyled" colorScheme='gray' size='md'>
                    <Tbody fontSize={20}>
                        <Tr>
                            <Td color='gray.700'>Role:</Td>
                            <Td color={UserRoleIcon[2]} display='flex' alignItems='center' gap={2}>
                                {UserRoleIcon[0]}
                                {user.role.toUpperCase()}
                            </Td>
                        </Tr>
                        <Tr>
                            <Td color='gray.700'>User Name:</Td>
                            <Td color='gray.500'>{user.username}</Td>
                        </Tr>
                        <Tr>
                            <Td color='gray.700'>Account Created Date:</Td>
                            <Td color='gray.500'>{formatDate(user.created_at)}</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
}

export default Profile;