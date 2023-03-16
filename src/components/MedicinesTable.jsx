import { Table, Thead, Tbody, Tr, Th, Td, InputGroup, InputLeftElement, Input, Image, Spinner, Center, Box, Icon, Text, IconButton, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';
import { TbMedicineSyrup } from 'react-icons/tb';
import {AiFillFolderOpen} from 'react-icons/ai'

const MedicinesTable = ({ medicines }) => {
    return (
        <>
            {/* <Text fontSize='sm' color='gray.500' p='10px' align='right'>10,000 Patients</Text> */}
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
                        <Th>quantity</Th>
                        <Th>expiration Date</Th>
                        <Th w='200px'><Text textAlign='center'>Detail</Text></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {medicines && medicines.map((medicine, index) => (
                        <Tr key={index}>
                            <Td p='1'>
                                <IconButton
                                    colorScheme={(medicine.gender == 'Male') ? 'blue' : 'pink'}
                                    aria-label='icon'
                                    size='md'
                                    icon={<TbMedicineSyrup size={25} />}
                                />
                            </Td>
                            <Td><Text fontWeight='normal' fontSize={20}>{medicine.name}</Text></Td>
                            <Td>{medicine.quantity}</Td>
                            <Td>{medicine.expiration_date}</Td>
                            <Td><NavLink to={medicine.id.toString()}><Button colorScheme='green' w='100%'><AiFillFolderOpen size={30}/></Button></NavLink></Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {!medicines && <Center p='10px'>
                <Spinner thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl' />
            </Center>}
        </>
    );
}

export default MedicinesTable;