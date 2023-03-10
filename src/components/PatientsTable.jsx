import { Table, Thead, Tbody, Tr, Th, Td, InputGroup, InputLeftElement, Input, Image, Spinner, Center, Box, Spacer, Text } from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';

const PatientsTable = () => {
    return (
        <>
            <Text fontSize='sm' color='gray.500' p='10px' align='right'>10,000 Patients</Text>
            <Table variant='simple'>
                <Thead>
                    <Tr bg='#fafafa'>
                        <Th w='50px' p='5'>#</Th>
                        <Th maxW='100px'>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<SearchIcon color='gray.300' />}
                                />
                                <Input variant='flushed' type='text' placeholder='Search by Name' />
                            </InputGroup>
                        </Th>
                        <Th>birth place</Th>
                        <Th>birth Date</Th>
                        <Th w='50px'><FiExternalLink size={20} /></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td p='1'><Image border='2px' borderColor='gray.200' boxSize='40px' src='https://bit.ly/dan-abramov' alt='Dan Abramov' /></Td>
                        <Td>Youcef Hemadou</Td>
                        <Td>Setif</Td>
                        <Td>22-11-2000</Td>
                        <Td><NavLink to='50'><FiExternalLink size={20} color='blue' /></NavLink></Td>
                    </Tr>
                    <Tr>
                        <Td p='1'><Image border='2px' borderColor='gray.200' boxSize='40px' src='https://bit.ly/dan-abramov' alt='Dan Abramov' /></Td>
                        <Td>Bouloudnine Sami</Td>
                        <Td>Jijle</Td>
                        <Td>22-11-2000</Td>
                        <Td><NavLink to='50'><FiExternalLink size={20} color='blue' /></NavLink></Td>
                    </Tr>

                </Tbody>
            </Table>
            {/* <Center p='10px'><Spinner /></Center> */}
        </>
    );
}

export default PatientsTable;