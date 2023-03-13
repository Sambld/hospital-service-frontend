import { Table, Thead, Tbody, Tr, Th, Td, InputGroup, InputLeftElement, Input, Image, Spinner, Center, Box, Icon, Text, IconButton, Button } from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';
import { BsGenderFemale, BsGenderMale } from 'react-icons/bs';
import {AiFillFolderOpen} from 'react-icons/ai'

const PatientsTable = ({ patients }) => {
    return (
        <>
            <Text fontSize='sm' color='gray.500' p='10px' align='right'>10,000 Patients</Text>
            <Table variant='simple' colorScheme='blackAlpha'>
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
                        <Th w='200px'><Text textAlign='center'>Open</Text></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {patients && patients.map((patient, index) => (
                        <Tr key={index}>
                            <Td p='1'>
                                <IconButton
                                    colorScheme={(patient.gender == 'Male') ? 'blue' : 'pink'}
                                    aria-label='Call Segun'
                                    size='md'
                                    icon={(patient.gender == 'Male') ? <BsGenderMale size={25} /> : <BsGenderFemale size={25} />}
                                />
                            </Td>
                            <Td><Text fontWeight='normal' fontSize={20}>{patient.first_name + " " + patient.last_name}</Text></Td>
                            <Td>{patient.place_of_birth}</Td>
                            <Td>{patient.birth_date}</Td>
                            <Td><NavLink to={patient.id.toString()}><Button colorScheme='green' w='100%'><AiFillFolderOpen size={30}/></Button></NavLink></Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {!patients && <Center p='10px'>
                <Spinner thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl' />
            </Center>}
        </>
    );
}

export default PatientsTable;